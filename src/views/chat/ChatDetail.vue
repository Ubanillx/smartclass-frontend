<template>
  <div class="chat-detail">
    <!-- 返回按钮 -->
    <back-button :title="assistant.name" class="back-button" />

    <!-- 测试按钮 - 仅用于开发测试 -->
    <div class="test-button-container">
      <van-button type="primary" size="small" @click="sendMarkdownTest"
        >测试Markdown</van-button
      >
    </div>

    <!-- 消息列表区域 -->
    <div class="message-container">
      <message-list
        :messages="messages"
        :assistant-avatar="assistant.avatar"
        :user-avatar="userInfo.avatar"
        :loading="loading"
        :custom-format-message="formatMessage"
      />
    </div>

    <!-- 底部输入框 -->
    <div class="input-container">
      <chat-input
        v-model="inputMessage"
        :disabled="loading"
        @send="sendMessage"
        @emoji="showEmojiPicker = true"
        @image="uploadImage"
        @voice="startVoiceRecord"
        @fullscreen="showFullscreenInput = true"
      />
    </div>

    <!-- 表情选择器 -->
    <van-popup
      v-model:show="showEmojiPicker"
      position="bottom"
      :style="{ height: '30%' }"
      round
    >
      <div class="emoji-picker">
        <div class="emoji-header">
          <span class="title">选择表情</span>
          <van-icon name="cross" @click="showEmojiPicker = false" />
        </div>
        <div class="emoji-grid">
          <span
            v-for="emoji in emojiList"
            :key="emoji"
            class="emoji-item"
            @click="selectEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </van-popup>

    <!-- 全屏输入框 -->
    <van-popup
      v-model:show="showFullscreenInput"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <div class="fullscreen-input">
        <div class="fullscreen-header">
          <span class="title">编辑消息</span>
          <van-icon name="cross" size="20" @click="showFullscreenInput = false" />
        </div>
        <div class="fullscreen-content">
          <div class="textarea-container">
            <textarea
              v-model="inputMessage"
              placeholder="输入消息..."
              class="custom-textarea"
              rows="12"
            ></textarea>
          </div>
        </div>
        <div class="fullscreen-footer">
          <div class="footer-left">
            <div class="action-icons">
              <van-icon name="smile-o" size="20" @click="showEmojiPicker = true" />
              <van-icon name="photograph" size="20" @click="uploadImage" />
              <van-icon name="records" size="20" @click="startVoiceRecord" />
            </div>
          </div>
          <van-button 
            size="mini" 
            type="primary" 
            :disabled="!inputMessage.trim()"
            @click="sendFullscreenMessage"
            class="send-button"
          >
            发送
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import { MessageList, ChatInput } from '../../components/Dialogue';
import { BackButton } from '../../components/Common';
import { useUserStore } from '../../stores/userStore';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface UserInfo {
  id: number;
  name: string;
  avatar: string;
}

interface Assistant {
  id: number;
  name: string;
  avatar: string;
  description: string;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
}

const router = useRouter();
const route = useRoute();
const inputMessage = ref('');
const loading = ref(false);
const showEmojiPicker = ref(false);
const showFullscreenInput = ref(false);
const userStore = useUserStore();

// 配置marked选项
marked.setOptions({
  breaks: true, // 启用换行符
  gfm: true, // 启用GitHub风格的Markdown
});

// 表情列表
const emojiList = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '😊',
  '😇',
  '🙂',
  '🙃',
  '😉',
  '😌',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '😋',
  '😛',
  '😝',
  '😜',
  '🤪',
  '🤨',
  '🧐',
  '🤓',
  '😎',
  '🤩',
  '🥳',
];

// 用户信息
const userInfo = ref<UserInfo>({
  id: 1,
  name: '用户',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
});

// 助手信息
const assistant = ref<Assistant>({
  id: Number(route.query.assistantId) || 1,
  name: '英语教师 Emma',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  description: '专业英语教学，语法讲解，口语指导',
});

// 消息列表
const messages = ref<Message[]>([
  {
    id: 1,
    type: 'ai',
    content: '你好！我是你的英语老师Emma。今天我们要学习什么呢？',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 2,
    type: 'user',
    content: '你好！我想学习一些日常英语对话。',
    timestamp: Date.now() - 3500000,
  },
  {
    id: 3,
    type: 'ai',
    content:
      '太好了！日常对话是提高英语实用能力的好方法。我们可以从简单的问候开始，然后逐渐学习更复杂的对话场景。你有特别想学习的场景吗？比如餐厅点餐、购物或者旅游？',
    timestamp: Date.now() - 3400000,
  },
]);

// 初始化用户信息
onMounted(async () => {
  // 如果用户信息不存在，尝试获取
  if (!userStore.userInfo) {
    await userStore.fetchCurrentUser();
  }

  // 更新用户头像
  if (userStore.userInfo && userStore.userInfo.userAvatar) {
    userInfo.value.avatar = userStore.userInfo.userAvatar;
  }
});

// 发送全屏输入框消息
const sendFullscreenMessage = () => {
  if (inputMessage.value.trim()) {
    sendMessage(inputMessage.value);
    showFullscreenInput.value = false;
  }
};

// 发送测试Markdown消息
const sendMarkdownTest = () => {
  // 添加用户消息
  const userMessage: Message = {
    id: messages.value.length + 1,
    type: 'user',
    content: '请给我一个复杂的Markdown格式示例',
    timestamp: Date.now(),
  };
  messages.value.push(userMessage);

  // 模拟AI回复
  loading.value = true;

  setTimeout(() => {
    // 复杂的Markdown格式回答示例
    let aiResponse = `# 英语学习指南：日常对话与实用表达 🌟

## 1. 基础问候语 👋

在英语交流中，恰当的问候是建立良好第一印象的关键。以下是一些常用的问候语：

* **正式场合**：
  * Good morning/afternoon/evening, pleased to meet you.
  * How do you do? (非常正式，通常只在初次见面时使用)
* **日常场合**：
  * Hi there! How's it going?
  * Hey! What's up?
  * Hello! How are you today?

> 💡 **小贴士**：问候语的选择应根据场合和关系亲密度来决定。与陌生人或长辈交流时，选择更正式的问候方式。

## 2. 常见日常对话场景 🗣️

### 2.1 咖啡店点餐

\`\`\`dialogue
顾客: Hi, could I get a medium latte, please?
店员: Sure. Would you like that hot or iced?
顾客: Hot, please. And could I add a shot of vanilla?
店员: No problem. Anything else for you today?
顾客: That's it, thanks.
店员: That'll be $4.50. Cash or card?
顾客: Card, please.
\`\`\`

### 2.2 问路对话

当你需要问路时，可以使用以下表达：

1. Excuse me, could you tell me how to get to the museum?
2. I'm looking for the nearest subway station. Is it far from here?
3. Is there a good restaurant around here?

回应方式：
* It's about 10 minutes' walk in that direction.
* Take the second right, then go straight ahead.
* You can't miss it, it's the big building on the left.

## 3. 实用词汇表 📚

| 英文表达 | 中文含义 | 使用场景 | 例句 |
|---------|---------|---------|------|
| Excuse me | 打扰一下 | 引起注意/道歉 | Excuse me, is this seat taken? |
| I'm afraid | 恐怕/遗憾 | 表达歉意/拒绝 | I'm afraid I can't make it tomorrow. |
| Actually | 实际上 | 纠正/澄清 | Actually, the meeting is at 3 PM, not 2 PM. |
| I was wondering | 我在想 | 礼貌请求 | I was wondering if you could help me with this. |
| That makes sense | 有道理 | 表示理解 | Oh, that makes sense. I understand now. |

## 4. 语法要点：现在进行时 ⏳

现在进行时用于表达**正在进行**的动作。

### 构成方式：
\`\`\`
主语 + am/is/are + 动词ing形式
\`\`\`

### 示例：
* I **am studying** English now.
* She **is working** on a new project.
* They **are having** dinner at the restaurant.

### 否定形式：
* I **am not** (I'm not) studying English now.
* She **is not** (isn't) working on a new project.
* They **are not** (aren't) having dinner at the restaurant.

## 5. 发音技巧：连读 🔊

英语中的连读是提高口语流利度的关键技巧之一。

例如：
* "What are you doing?" 通常发音为 "Wha**t_a**re you doing?"
* "Turn it off" 通常发音为 "Tur**n_i**t off"

<details>
<summary>**点击展开更多连读规则**</summary>

1. 辅音+元音：两个词之间，前一个词以辅音结尾，后一个词以元音开头
   * get_up, take_it, read_a book

2. 相同辅音连读：两个相同的辅音相遇时，只发一次音
   * stop_pushing (发音类似于 "sto pushing")
</details>

## 6. 学习资源推荐 📱

以下是一些优质的英语学习资源：

* **应用程序**：
  - [Duolingo](https://www.duolingo.com) - 游戏化学习体验
  - [HelloTalk](https://www.hellotalk.com) - 语言交换平台

* **YouTube频道**：
  - [English with Lucy](https://www.youtube.com/c/EnglishwithLucy)
  - [Rachel's English](https://www.youtube.com/c/rachelsenglish)

* **播客**：
  - 6 Minute English (BBC)
  - All Ears English

## 7. 每日练习计划 📝

为了有效提高英语水平，建议遵循以下学习计划：

| 时间 | 活动 | 目标 |
|------|------|------|
| 早晨 | 词汇学习 | 学习10个新单词 |
| 午餐时 | 听力练习 | 听一集英语播客 |
| 晚上 | 口语练习 | 大声朗读或与伙伴对话 |

---

希望这些资料对你的英语学习有所帮助！如果有任何问题，随时向我提问。

![英语学习](https://example.com/english-learning.jpg)

> *"Language is the road map of a culture. It tells you where its people come from and where they are going."* — Rita Mae Brown`;

    const aiMessage: Message = {
      id: messages.value.length + 1,
      type: 'ai',
      content: aiResponse,
      timestamp: Date.now(),
    };
    messages.value.push(aiMessage);
    loading.value = false;
  }, 1000);
};

// 发送消息
const sendMessage = async (text: string) => {
  if (!text.trim()) return;

  // 添加用户消息
  const userMessage: Message = {
    id: messages.value.length + 1,
    type: 'user',
    content: text,
    timestamp: Date.now(),
  };
  messages.value.push(userMessage);

  // 模拟AI回复
  loading.value = true;
  try {
    // 这里可以添加实际的API调用
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 简单的回复，可以根据需要修改为Markdown格式
    const aiMessage: Message = {
      id: messages.value.length + 1,
      type: 'ai',
      content: `这是对"${text}"的回复。你可以点击上方的"测试Markdown"按钮来查看复杂的Markdown格式示例。`,
      timestamp: Date.now(),
    };
    messages.value.push(aiMessage);
  } catch (error) {
    showToast('发送失败，请重试');
    console.error('发送消息失败:', error);
  } finally {
    loading.value = false;
    inputMessage.value = ''; // 清空输入框
  }
};

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 格式化消息内容（处理Markdown）
const formatMessage = (content: string): string => {
  try {
    // 使用marked解析Markdown，设置async: false确保返回string类型
    const rawHtml = marked.parse(content, { async: false });
    // 使用DOMPurify净化HTML，防止XSS攻击
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return cleanHtml;
  } catch (error) {
    console.error('Markdown解析失败:', error);
    return content;
  }
};

// 选择表情
const selectEmoji = (emoji: string): void => {
  inputMessage.value += emoji;
  showEmojiPicker.value = false;
};

// 上传图片
const uploadImage = (): void => {
  showToast('图片上传功能开发中');
};

// 开始语音录制
const startVoiceRecord = (): void => {
  showToast('语音录制功能开发中');
};
</script>

<style scoped>
.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8fa;
  position: relative;
}

.back-button {
  flex-shrink: 0;
}

.test-button-container {
  padding: 8px 16px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.message-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.input-container {
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 10;
  padding-bottom: 8px;
}

/* 消息列表样式覆盖 */
:deep(.message-list) {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 16px;
}

/* 全屏输入框样式 */
.fullscreen-input {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.fullscreen-header .title {
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.fullscreen-content {
  flex: 1;
  padding: 16px;
  overflow: hidden;
}

.fullscreen-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #ebedf0;
}

.fullscreen-footer .action-icons {
  display: flex;
  gap: 24px;
  color: #969799;
}

.fullscreen-footer .send-button {
  border-radius: 4px;
  padding: 0 14px;
  height: 32px;
  font-size: 14px;
}

.textarea-container {
  height: 100%;
  width: 100%;
}

.custom-textarea {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: none;
  padding: 12px;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  overflow-y: auto;
}

.emoji-picker {
  padding: 16px;
}

.emoji-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.emoji-header .title {
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
}

.emoji-item {
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

/* 自定义AI消息样式 */
:deep(.message-item.ai .message-content) {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 增强Markdown样式 */
:deep(.markdown-body) {
  font-size: 14px;
  line-height: 1.6;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 600;
  line-height: 1.25;
}

:deep(.markdown-body h1) {
  font-size: 18px;
}

:deep(.markdown-body h2) {
  font-size: 16px;
}

:deep(.markdown-body h3) {
  font-size: 15px;
}

:deep(.markdown-body p) {
  margin: 8px 0;
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 20px;
  margin: 8px 0;
}

:deep(.markdown-body li) {
  margin: 4px 0;
}

:deep(.markdown-body blockquote) {
  padding: 0 8px;
  color: #6a737d;
  border-left: 3px solid #dfe2e5;
  margin: 8px 0;
}

:deep(.markdown-body code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 13px;
}

:deep(.markdown-body pre) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 8px 0;
}

:deep(.markdown-body pre code) {
  background-color: transparent;
  padding: 0;
}

:deep(.markdown-body table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

:deep(.markdown-body table th),
:deep(.markdown-body table td) {
  border: 1px solid #dfe2e5;
  padding: 6px 12px;
  text-align: left;
}

:deep(.markdown-body table th) {
  background-color: #f6f8fa;
}

:deep(.markdown-body img) {
  max-width: 100%;
  height: auto;
}

:deep(.markdown-body a) {
  color: #1989fa;
  text-decoration: none;
}

:deep(.markdown-body a:hover) {
  text-decoration: underline;
}

:deep(.markdown-body hr) {
  height: 1px;
  background-color: #dfe2e5;
  border: none;
  margin: 16px 0;
}

:deep(.markdown-body strong) {
  font-weight: 600;
}

:deep(.markdown-body em) {
  font-style: italic;
}
</style>
