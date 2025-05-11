import { ref } from 'vue';
import { showToast } from 'vant';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import katex from 'katex';
import { OpenAPI } from '../../services/core/OpenAPI';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useUserStore } from '../../stores/userStore';
import { useRouter } from 'vue-router';

export interface UserInfo {
  id: number;
  name: string;
  avatar: string;
}

export interface Assistant {
  id: number;
  name: string;
  avatar: string;
  description: string;
  status?: number;
}

export interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
  isRead?: number;
}

export function useChatMessages(assistant: Assistant) {
  const router = useRouter();
  const userStore = useUserStore();
  const messages = ref<Message[]>([]);
  const isAITyping = ref<boolean>(false);
  const currentAIMessageId = ref<number | null>(null);
  const sessionId = ref<string | undefined>(undefined);
  
  // 控制请求的变量
  let currentEventSource: EventSource | null = null;
  let currentStreamController: AbortController | null = null;

  // 配置DOMPurify允许KaTeX相关标签和属性
  DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    // 如果是KaTeX生成的元素，保留所有属性
    if (
      node.classList &&
      (node.classList.contains('katex') ||
        node.classList.contains('katex-html') ||
        node.classList.contains('katex-mathml'))
    ) {
      node.setAttribute('data-katex-processed', 'true');
    }
  });

  // 格式化消息内容（处理Markdown和LaTeX）
  const formatMessage = (content: string): string => {
    try {
      // 处理块级公式 $$...$$
      let processedContent = content.replace(
        /\$\$([\s\S]+?)\$\$/g,
        (match, formula) => {
          try {
            return `<div class="katex-block">${katex.renderToString(
              formula.trim(),
              {
                displayMode: true,
                throwOnError: false,
              },
            )}</div>`;
          } catch (err) {
            console.error('LaTeX块级公式解析错误:', err);
            return match;
          }
        },
      );

      // 处理行内公式 $...$，但排除可能的货币符号 ($10, 10$等)
      const inlineFormulaRegex = /\$([^\$\n]+?)\$/g;
      processedContent = processedContent.replace(
        inlineFormulaRegex,
        (match, formula) => {
          // 检查是否为货币符号
          if (/^\$\d/.test(match) || /\d\$$/.test(match)) {
            return match;
          }

          try {
            return katex.renderToString(formula.trim(), {
              displayMode: false,
              throwOnError: false,
            });
          } catch (err) {
            console.error('LaTeX行内公式解析错误:', err);
            return match;
          }
        },
      );

      // 使用Marked解析Markdown
      const html = marked.parse(processedContent, { async: false });

      // 配置DOMPurify
      const purifyConfig = {
        ADD_TAGS: [
          'math',
          'mrow',
          'mi',
          'mo',
          'mn',
          'msup',
          'msub',
          'mfrac',
          'mspace',
          'mtext',
          'annotation',
          'semantics',
          'svg',
          'line',
          'path',
          'g',
        ],
        ADD_ATTR: [
          'xlink:href',
          'href',
          'fill',
          'stroke',
          'stroke-width',
          'stroke-linecap',
          'stroke-linejoin',
          'd',
          'width',
          'height',
          'viewBox',
          'style',
          'data-katex-processed',
          'class',
        ],
        ALLOW_DATA_ATTR: true,
      };

      // 净化HTML防止XSS攻击
      return DOMPurify.sanitize(html, purifyConfig);
    } catch (error) {
      console.error('内容解析失败:', error);
      return content;
    }
  };

  // 添加欢迎消息
  const addWelcomeMessage = () => {
    if (assistant.name) {
      const welcomeMessage: Message = {
        id: Date.now(),
        type: 'ai',
        content: `你好！我是${assistant.name}。${assistant.description ? assistant.description : '有什么我可以帮助你的吗？'}`,
        timestamp: Date.now(),
      };
      messages.value = [welcomeMessage];
    }
  };

  // 更新AI消息内容的辅助函数
  const updateAIMessage = (content: string) => {
    const messageIndex = messages.value.findIndex(
      (msg) => msg && msg.id === currentAIMessageId.value,
    );
    if (messageIndex !== -1 && messages.value[messageIndex]) {
      messages.value[messageIndex].content = content;

      // 自动滚动到底部
      const messagesContainer = document.querySelector('.message-list');
      if (messagesContainer instanceof HTMLElement) {
        setTimeout(() => {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 0);
      }
    }
  };

  // 停止流式响应
  const stopStreamingResponse = async () => {
    // 中断当前的SSE连接
    if (currentStreamController) {
      currentStreamController.abort();
      currentStreamController = null;
    }

    // 关闭现有的EventSource连接
    if (currentEventSource) {
      currentEventSource.close();
      currentEventSource = null;
    }

    isAITyping.value = false;
    currentAIMessageId.value = null;
  };

  // 发送消息函数
  const sendMessage = async (text: string, regenerate = false) => {
    if (!text.trim() || isAITyping.value) return;

    // 如果有正在进行的请求，先停止
    if (currentEventSource || currentStreamController) {
      await stopStreamingResponse();
    }

    // 添加用户消息（仅在非重新生成模式下）
    if (!regenerate) {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: text,
        timestamp: Date.now(),
      };
      messages.value.push(userMessage);
    }

    // 设置AI正在输入状态
    isAITyping.value = true;

    // 创建AI消息占位
    const aiMessageId = Date.now() + 1;
    currentAIMessageId.value = aiMessageId;
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: Date.now(),
    };
    messages.value.push(aiMessage);

    try {
      // 准备消息请求
      const messageRequest: any = {
        aiAvatarId: assistant.id,
        content: text,
        sessionId: sessionId.value ? sessionId.value : '',
        messageType: 'user',
      };

      // 如果是重新生成，增加regenerate标记
      if (regenerate) {
        messageRequest.regenerate = true;
      }

      // 创建控制器
      const controller = new AbortController();
      currentStreamController = controller;

      // 保存消息内容变量
      let content = '';

      // 获取API基础URL
      const apiUrl = `${OpenAPI.BASE}/api/chat/message/stream`;

      // 使用fetchEventSource发起POST请求获取SSE流
      await fetchEventSource(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageRequest),
        signal: controller.signal,
        credentials: 'include', // 包含cookies，确保会话认证信息被发送

        // 处理连接打开事件
        async onopen(response) {
          // 判断是否连接成功
          if (
            response.ok &&
            response.headers.get('content-type')?.includes('text/event-stream')
          ) {
            return; // 连接成功
          } else if (response.status === 401 || response.status === 403) {
            // 未授权或禁止访问（未登录）
            showToast('登录已过期，请重新登录');

            // 清除本地登录状态
            userStore.logout();

            // 重定向到登录页面，可以保存当前路径用于登录后返回
            router.push({
              path: '/login',
              query: { redirect: router.currentRoute.value.fullPath },
            });

            throw new Error(`未登录: ${response.status}`);
          } else if (response.status === 404) {
            // 会话不存在，需要重新创建会话
            // 将sessionId设为undefined，使下次发送消息时创建新会话
            sessionId.value = undefined;

            throw new Error('会话不存在，请重新发送消息');
          } else {
            // 其他错误
            throw new Error(`SSE连接失败: ${response.status}`);
          }
        },

        // 处理消息事件
        onmessage(event) {
          try {
            // 检查数据是否为空
            if (!event.data || event.data.trim() === '') {
              return;
            }

            // 解析消息数据
            const data = JSON.parse(event.data);

            // 根据消息格式提取内容
            if (data) {
              // 检查是否包含会话ID信息，如果有则更新会话ID
              if (data.event === 'message_end' && data.conversation_id) {
                if (data.conversation_id !== sessionId.value) {
                  sessionId.value = data.conversation_id;
                }
                return; // message_end 事件不包含内容，直接返回
              }

              // 跳过系统消息类型，如"SSE连接已建立"等提示信息
              if (
                data.message === 'SSE连接已建立' ||
                data.content === 'SSE连接已建立' ||
                data.data === '会话已创建' ||
                data.message === '会话已创建' ||
                data.content === '会话已创建' ||
                data.message === '流式响应已完成' ||
                data.content === '流式响应已完成' ||
                data.data === '流式响应已完成' ||
                /流式响应已完成/.test(JSON.stringify(data)) ||
                /SSE连接已建立/.test(JSON.stringify(data)) ||
                /会话已创建/.test(JSON.stringify(data))
              ) {
                return;
              }

              // 检查message事件的各种可能格式
              if (data.event === 'message') {
                if (data.answer) {
                  content += data.answer;
                } else if (data.content) {
                  content += data.content;
                } else if (data.data) {
                  content += data.data;
                } else if (data.choices && data.choices.length > 0) {
                  // OpenAI格式
                  if (data.choices[0].delta && data.choices[0].delta.content) {
                    content += data.choices[0].delta.content;
                  } else if (
                    data.choices[0].message &&
                    data.choices[0].message.content
                  ) {
                    content += data.choices[0].message.content;
                  }
                } else if (typeof data === 'string') {
                  content += data;
                }
              }

              // 更新消息内容（如果有变化）
              if (content) {
                updateAIMessage(content);
              }
            }
          } catch (err: any) {
            // 处理错误，可能是JSON解析错误或其他异常
            showToast('处理消息时发生错误');
          }
        },

        // 处理错误事件
        onerror(err: Error) {
          // 处理连接错误
          showToast('连接服务器失败，请重试');

          // 尝试恢复UI状态
          isAITyping.value = false;

          // 添加错误消息
          if (currentAIMessageId.value && messages.value.length > 0) {
            const lastMessage = messages.value.find(
              (m) => m.id === currentAIMessageId.value,
            );
            if (lastMessage) {
              lastMessage.content = '抱歉，我遇到了一些问题，请重试。';
            }
            currentAIMessageId.value = null;
          }
        },

        // 处理连接关闭事件
        onclose() {
          // 连接关闭，更新UI状态
          isAITyping.value = false;
          currentAIMessageId.value = null;
          currentEventSource = null;
          currentStreamController = null;
        },
      });
    } catch (error) {
      // 处理发送过程中的错误
      isAITyping.value = false;
      showToast('发送消息失败，请重试');

      // 如果有错误，添加错误提示到AI消息中
      if (currentAIMessageId.value && messages.value.length > 0) {
        const lastMessage = messages.value.find(
          (m) => m.id === currentAIMessageId.value,
        );
        if (lastMessage) {
          lastMessage.content = '抱歉，发送消息时遇到了问题，请重试。';
        }
        currentAIMessageId.value = null;
      }
    }
  };

  // 重新生成回答
  const regenerateResponse = async (messageId: number) => {
    // 如果当前正在生成回答，先停止
    if (isAITyping.value) {
      await stopStreamingResponse();
    }

    // 找到对应消息的前一条用户消息
    const aiMessageIndex = messages.value.findIndex(msg => msg.id === messageId);
    if (aiMessageIndex <= 0) {
      showToast('无法找到相关消息');
      return;
    }
    
    // 查找AI消息之前的最近一条用户消息
    let userMessageIndex = -1;
    for (let i = aiMessageIndex - 1; i >= 0; i--) {
      if (messages.value[i]?.type === 'user') {
        userMessageIndex = i;
        break;
      }
    }

    if (userMessageIndex === -1) {
      showToast('无法找到相关问题');
      return;
    }

    // 确保用户消息存在
    const userMessage = messages.value[userMessageIndex];
    if (!userMessage) {
      showToast('无法找到相关问题');
      return;
    }
    
    // 移除AI回复消息
    messages.value.splice(aiMessageIndex, 1);
    
    // 以重新生成模式发送消息
    await sendMessage(userMessage.content, true);
  };

  return {
    messages,
    isAITyping,
    sessionId,
    addWelcomeMessage,
    stopStreamingResponse,
    sendMessage,
    regenerateResponse,
    formatMessage
  };
} 