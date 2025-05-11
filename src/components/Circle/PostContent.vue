<template>
  <div class="post-card-detail">
    <div class="post-content">
      <h3 class="post-title">{{ title }}</h3>
      <!-- 使用v-html渲染Markdown和KaTeX解析后的内容 -->
      <div class="post-text markdown-body" v-html="renderedContent"></div>
      <!-- 图片列表 -->
      <div v-if="images && images.length > 0" class="post-images">
        <van-image
          v-for="(img, index) in images"
          :key="index"
          width="100%"
          :src="img"
          radius="4px"
          class="post-image"
          @click="handleImageClick(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { showImagePreview } from 'vant';
import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';

interface PostContentProps {
  title: string;
  content: string;
  images?: string[];
}

const props = withDefaults(defineProps<PostContentProps>(), {
  title: '',
  content: '',
  images: () => []
});

const emit = defineEmits<{
  (e: 'image-preview', index: number): void;
}>();

// 初始化 markdown-it 实例
const md = new MarkdownIt({
  html: true,        // 允许HTML标签
  breaks: true,      // 转换段落里的 '\n' 到 <br>
  linkify: true,     // 自动将URL文本转换为链接
  typographer: true  // 启用一些语言中立的替换 + 引号美化
});

// 使用markdown-it-katex插件渲染LaTeX公式
md.use(markdownItKatex);

// 自定义代码块渲染规则
md.renderer.rules.code_block = function(tokens, idx) {
  const code = tokens[idx]?.content || '';
  return `<pre class="simple-code-block"><code>${code}</code></pre>`;
};

md.renderer.rules.fence = function(tokens, idx) {
  const token = tokens[idx];
  const code = token?.content || '';
  const langName = token?.info || '';
  
  return `<pre class="simple-code-block"><code>${code}</code></pre>`;
};

// 安全地渲染Markdown内容
const renderedContent = computed(() => {
  try {
    // 确保content存在且是字符串
    const content = props.content || '';
    if (typeof content !== 'string') {
      console.error('Post content is not a string:', content);
      return String(content);
    }
    
    // 使用markdown-it和markdown-it-katex解析Markdown和LaTeX公式
    const rawHtml = md.render(content);
    
    // 确保rawHtml是字符串
    const htmlContent = typeof rawHtml === 'string' ? rawHtml : String(rawHtml);
    
    // 使用DOMPurify清理HTML，但允许数学公式需要的标签通过
    return DOMPurify.sanitize(htmlContent, {
      ADD_ATTR: ['target', 'class', 'style'],
      ADD_TAGS: ['svg', 'path', 'use'],
      USE_PROFILES: { html: true, svg: true, mathMl: true }
    });
  } catch (error) {
    console.error('Markdown渲染错误:', error);
    return props.content || '';
  }
});

// 处理图片点击预览
const handleImageClick = (index: number) => {
  if (props.images && props.images.length > 0) {
    showImagePreview({
      images: props.images,
      startPosition: index
    });
    emit('image-preview', index);
  }
};
</script>

<style scoped>
.post-card-detail {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin: 16px 16px 0 16px;
  padding: 0;
  overflow: hidden;
}

.post-content {
  padding: 16px 20px 20px 20px;
}

.post-title {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: #323233;
  margin: 0 0 8px;
  line-height: 1.4;
}

.post-text {
  font-size: var(--font-size-md);
  color: #323233;
  line-height: 1.6;
  margin: 0 0 12px;
  white-space: pre-wrap;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
  margin-bottom: 0;
}

.post-image {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  cursor: pointer;
}

/* 添加Markdown样式 */
:deep(.markdown-body) {
  line-height: 1.6;
  word-wrap: break-word;
  color: #2c3e50;
  font-size: 15px;
}

:deep(.markdown-body h1), 
:deep(.markdown-body h2), 
:deep(.markdown-body h3), 
:deep(.markdown-body h4), 
:deep(.markdown-body h5), 
:deep(.markdown-body h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #1a202c;
}

:deep(.markdown-body h1) {
  font-size: 1.8em;
  padding-bottom: 0.4em;
  border-bottom: 1px solid #edf2f7;
}

:deep(.markdown-body h2) {
  font-size: 1.5em;
  padding-bottom: 0.4em;
  border-bottom: 1px solid #edf2f7;
}

:deep(.markdown-body h3) {
  font-size: 1.25em;
}

:deep(.markdown-body h4) {
  font-size: 1em;
}

:deep(.markdown-body h5), :deep(.markdown-body h6) {
  font-size: 0.875em;
}

:deep(.markdown-body p) {
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 1.7;
}

:deep(.markdown-body a) {
  color: #1989fa;
  text-decoration: none;
  border-bottom: 1px solid rgba(25, 137, 250, 0.3);
  transition: border-color 0.2s ease;
}

:deep(.markdown-body a:hover) {
  border-bottom-color: #1989fa;
}

:deep(.markdown-body ul), :deep(.markdown-body ol) {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(.markdown-body li) {
  margin-bottom: 0.5em;
}

:deep(.markdown-body li + li) {
  margin-top: 0.25em;
}

:deep(.markdown-body blockquote) {
  margin: 0 0 16px 0;
  padding: 0.8em 1em;
  color: #4a5568;
  background-color: #f8fafc;
  border-left: 4px solid #1989fa;
  border-radius: 0 4px 4px 0;
}

:deep(.markdown-body blockquote > :first-child) {
  margin-top: 0;
}

:deep(.markdown-body blockquote > :last-child) {
  margin-bottom: 0;
}

:deep(.markdown-body code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
  font-family: "SFMono-Regular", "Cascadia Mono", "Consolas", monospace;
  color: #d63031;
}

:deep(.markdown-body pre) {
  word-wrap: normal;
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.5;
  background-color: #f6f8fa;
  border-radius: 6px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.markdown-body pre code) {
  padding: 0;
  margin: 0;
  background-color: transparent;
  border: 0;
  overflow-wrap: normal;
  word-break: normal;
  color: #24292e;
  font-size: 90%;
}

:deep(.markdown-body img) {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
}

:deep(.markdown-body hr) {
  height: 1px;
  padding: 0;
  margin: 24px 0;
  background-color: #e2e8f0;
  border: 0;
}

:deep(.markdown-body table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
  overflow-x: auto;
  display: block;
}

:deep(.markdown-body table th),
:deep(.markdown-body table td) {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
}

:deep(.markdown-body table th) {
  background-color: #f8fafc;
  font-weight: 600;
}

:deep(.markdown-body table tr:nth-child(2n)) {
  background-color: #f9fafb;
}

:deep(.markdown-body mark) {
  background-color: #fdfdac;
  padding: 0.1em 0.2em;
  border-radius: 2px;
}

:deep(.markdown-body del) {
  color: #718096;
}

/* KaTeX公式样式 */
:deep(.katex-display) {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.8em;
  background: #f9fafb;
  border-radius: 6px;
  margin: 1.2em 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.katex-block) {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1.2em;
  background: #f9fafb;
  border-radius: 6px;
  margin: 1.2em 0;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.katex) {
  font-size: 1.15em;
}

/* 简化的代码块样式 */
:deep(.simple-code-block) {
  margin: 16px 0;
  padding: 16px;
  background-color: #f6f8fa;
  border-radius: 6px;
  overflow-x: auto;
  font-family: "SFMono-Regular", "Cascadia Mono", "Consolas", monospace;
}

:deep(.simple-code-block code) {
  white-space: pre;
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
  background: transparent;
  padding: 0;
  border: 0;
}
</style> 