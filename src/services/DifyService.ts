/**
 * Dify API Service
 * 提供与Dify AI对话API的交互功能
 */

// Dify API配置
const DIFY_API_BASE_URL = 'http://10.0.124.181/v1';
const DIFY_API_KEY = 'app-Hq8YLYBObZI0XbfjtGOWY2MC';

interface ChatMessage {
  query: string;
  inputs?: Record<string, any>;
  response_mode?: 'streaming' | 'blocking';
  user?: string;
  conversation_id?: string;
  files?: Array<{
    type: string;
    transfer_method: string;
    url?: string;
    upload_file_id?: string;
  }>;
  auto_generate_name?: boolean;
}

interface ChatResponse {
  event: string;
  task_id?: string;
  id?: string;
  message_id?: string;
  conversation_id?: string;
  answer?: string;
  created_at?: number;
  metadata?: {
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    retriever_resources?: Array<any>;
  };
  status?: number;
  code?: string;
  message?: string;
}

/**
 * 发送对话消息（流式响应）
 * @param message 消息内容
 * @param conversationId 会话ID
 * @param userId 用户ID
 * @param onMessage 消息回调函数
 * @param onError 错误回调函数
 * @param onEnd 结束回调函数
 * @param inputs 输入参数，如分身类型等
 * @returns 返回一个函数，调用该函数可以中止请求
 */
export const sendChatMessage = (
  message: string,
  conversationId: string | undefined,
  userId: string,
  onMessage: (text: string) => void,
  onError: (error: Error) => void,
  onEnd: (conversationId: string) => void,
  inputs?: Record<string, any>,
): (() => void) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const requestBody: ChatMessage = {
    query: message,
    inputs: inputs || {},
    response_mode: 'streaming',
    user: userId,
    conversation_id: conversationId,
  };

  let currentConversationId = conversationId;
  let responseText = '';

  fetch(`${DIFY_API_BASE_URL}/chat-messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DIFY_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
    signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();

      function readStream(): Promise<void> {
        if (!reader) {
          return Promise.resolve();
        }
        
        return reader.read().then(({ done, value }) => {
          if (done) {
            // 流结束，如果有剩余文本则处理
            if (responseText.trim()) {
              onMessage(responseText);
            }
            if (currentConversationId) {
              onEnd(currentConversationId);
            }
            return;
          }

          // 解码数据
          const chunk = decoder.decode(value, { stream: true });

          // 处理SSE数据块
          const lines = chunk.split('\n\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = line.substring(6); // 去掉 'data: ' 前缀
                
                // 清理可能的无效Unicode转义序列
                const cleanData = data.replace(/\\u[0-9A-Fa-f]{0,3}([^0-9A-Fa-f]|$)/g, (match) => {
                  // 将无效的Unicode转义序列替换为问号
                  return '?' + match.substring(match.length - 1);
                });
                
                // 检查是否是有效的JSON
                if (!cleanData.trim()) continue;
                
                const jsonData = JSON.parse(cleanData) as ChatResponse;

                // 处理不同类型的事件
                if (jsonData.event === 'message') {
                  responseText += jsonData.answer || '';
                  onMessage(responseText);

                  // 保存会话ID
                  if (jsonData.conversation_id && !currentConversationId) {
                    currentConversationId = jsonData.conversation_id;
                  }
                } else if (jsonData.event === 'message_end') {
                  if (jsonData.conversation_id) {
                    currentConversationId = jsonData.conversation_id;
                    onEnd(currentConversationId);
                  }
                } else if (jsonData.event === 'error') {
                  throw new Error(jsonData.message || '未知错误');
                }
              } catch (e) {
                if (!(e instanceof Error && e.name === 'AbortError')) {
                  console.error('解析SSE数据失败:', e);
                  // 继续处理，不要因为一个错误的数据块而中断流程
                  continue;
                }
              }
            }
          }

          // 继续读取下一块数据
          return readStream();
        });
      }

      return readStream();
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Dify API请求失败:', error);
        onError(error);
      }
    });

  // 返回中止请求的函数
  return () => controller.abort();
};

/**
 * 发送对话消息（阻塞响应）
 * @param message 消息内容
 * @param conversationId 会话ID
 * @param userId 用户ID
 * @returns Promise<ChatResponse>
 */
export const sendChatMessageBlocking = async (
  message: string,
  conversationId: string | undefined,
  userId: string,
): Promise<ChatResponse> => {
  const requestBody: ChatMessage = {
    query: message,
    inputs: {},
    response_mode: 'blocking',
    user: userId,
    conversation_id: conversationId,
  };

  const response = await fetch(`${DIFY_API_BASE_URL}/chat-messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DIFY_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * 获取应用Meta信息
 * @returns Promise<any> 返回应用的Meta信息，包含工具图标等
 */
export const getDifyMeta = async (): Promise<any> => {
  try {
    console.log('正在请求获取Dify Meta信息...');
    const response = await fetch(`${DIFY_API_BASE_URL}/meta`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP错误! 状态: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const metaData = await response.json();
    console.log('获取到的Dify Meta信息:', JSON.stringify(metaData, null, 2));
    
    // 特别检查工具图标
    if (metaData.tool_icons) {
      console.log('工具图标数量:', Object.keys(metaData.tool_icons).length);
      console.log('工具图标内容:', JSON.stringify(metaData.tool_icons, null, 2));
    } else {
      console.warn('未找到工具图标数据!');
    }
    
    return metaData;
  } catch (error) {
    console.error('获取Dify Meta信息失败:', error);
    throw error;
  }
};

/**
 * 分身信息接口
 */
export interface Persona {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: number;
  tags?: string[];
}

/**
 * 获取所有分身信息
 * @returns Promise<Persona[]> 返回所有分身信息
 */
export const getAllPersonas = async (): Promise<Persona[]> => {
  try {
    console.log('开始获取分身信息...');
    
    // 直接返回预设分身数据
    const presetPersonas: Persona[] = [
      {
        id: 1,
        name: '英语教师 Emma',
        description: '专业英语教学，语法讲解，口语指导',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 1,
        tags: ['语法', '口语', '教学']
      },
      {
        id: 2,
        name: '口语伙伴 Mike',
        description: '日常英语对话，地道表达，场景练习',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 2,
        tags: ['口语', '日常对话', '场景练习']
      },
      {
        id: 3,
        name: '写作助手 Sarah',
        description: '作文指导，文章润色，写作技巧',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 3,
        tags: ['写作', '润色', '技巧']
      },
      {
        id: 4,
        name: '考试辅导员 Jack',
        description: '考试技巧，备考指导，模拟测试',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 4,
        tags: ['考试', '备考', '技巧']
      },
      {
        id: 5,
        name: '商务英语专家 Lisa',
        description: '商务邮件，会议对话，职场英语',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 5,
        tags: ['商务', '职场', '邮件']
      }
    ];
    
    console.log('返回的分身列表:', presetPersonas);
    return presetPersonas;
  } catch (error) {
    console.error('获取分身信息失败:', error);
    
    // 出错时返回默认分身列表
    return [
      {
        id: 1,
        name: '英语教师 Emma',
        description: '专业英语教学，语法讲解，口语指导',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 1,
        tags: ['语法', '口语', '教学']
      },
      {
        id: 2,
        name: '口语伙伴 Mike',
        description: '日常英语对话，地道表达，场景练习',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 2,
        tags: ['口语', '日常对话', '场景练习']
      },
      {
        id: 3,
        name: '写作助手 Sarah',
        description: '作文指导，文章润色，写作技巧',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 3,
        tags: ['写作', '润色', '技巧']
      },
      {
        id: 4,
        name: '考试辅导员 Jack',
        description: '考试技巧，备考指导，模拟测试',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 4,
        tags: ['考试', '备考', '技巧']
      },
      {
        id: 5,
        name: '商务英语专家 Lisa',
        description: '商务邮件，会议对话，职场英语',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        type: 5,
        tags: ['商务', '职场', '邮件']
      }
    ];
  }
};

/**
 * 创建emoji头像URL
 * @param emoji emoji字符
 * @param backgroundColor 背景颜色
 * @returns 头像URL
 */
const createEmojiAvatarUrl = (emoji: string, backgroundColor: string = '#1989fa'): string => {
  // 检查是否在浏览器环境中
  if (typeof document === 'undefined') {
    return '';
  }
  
  // 创建一个canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // 绘制背景
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 绘制emoji
  ctx.font = '120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);
  
  // 将canvas转换为图片URL
  return canvas.toDataURL('image/png');
};
