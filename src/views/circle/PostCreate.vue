<template>
  <div class="post-create">
    <!-- 顶部导航区域 -->
    <div class="nav-bar">
      <BackButton title="发布帖子" @click="onClickLeft" />
    </div>

    <!-- 帖子内容区域 -->
    <div class="post-form">
      <!-- 标题输入 -->
      <van-field
        v-model="postForm.title"
        placeholder="请输入标题"
        class="title-input"
        :maxlength="50"
        show-word-limit
      />

      <!-- 内容输入 -->
      <van-field
        v-model="postForm.content"
        type="textarea"
        placeholder="请输入正文内容，支持 Markdown 格式"
        class="content-input"
        :autosize="{ minHeight: 200 }"
        :maxlength="5000"
        show-word-limit
      />

      <!-- 图片上传 -->
      <div class="upload-section">
        <van-uploader
          v-model="postForm.images"
          :max-count="9"
          :after-read="afterRead"
          :before-read="beforeRead"
          :before-delete="beforeDelete"
          multiple
        />
      </div>

      <!-- 标签选择 -->
      <div class="tags-section">
        <div class="section-title">添加标签</div>
        <div class="tags-container">
          <van-tag
            v-for="tag in availableTags"
            :key="tag.id"
            :type="isTagSelected(tag) ? 'primary' : 'default'"
            class="tag-item"
            @click="toggleTag(tag)"
          >
            {{ tag.name }}
          </van-tag>
        </div>
      </div>

      <!-- Markdown 预览切换 -->
      <div class="preview-switch">
        <van-switch
          v-model="showPreview"
          size="24px"
          active-color="#1989fa"
        />
        <span class="switch-label">预览模式</span>
      </div>

      <!-- Markdown 预览区域 -->
      <div v-if="showPreview" class="preview-section">
        <div class="preview-title">预览</div>
        <div class="markdown-preview markdown-body" v-html="renderedContent"></div>
      </div>
      
      <!-- 发布按钮 -->
      <div class="submit-section">
        <van-button 
          class="submit-btn" 
          type="primary" 
          block
          @click="onSubmit"
        >
          发布
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showDialog } from 'vant';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import markdown from 'highlight.js/lib/languages/markdown';
import { BackButton } from '../../components/Common';

// 注册常用的语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('markdown', markdown);

const router = useRouter();

// 表单数据
const postForm = ref({
  title: '',
  content: '',
  images: [],
  tags: [] as number[]
});

// 预览开关
const showPreview = ref(false);

// 可用标签列表
const availableTags = [
  { id: 1, name: '问答' },
  { id: 2, name: '分享' },
  { id: 3, name: '讨论' },
  { id: 4, name: '建议' },
  { id: 5, name: '教程' },
  { id: 6, name: '公告' }
];

// 检查标签是否被选中
const isTagSelected = (tag: { id: number }) => {
  return postForm.value.tags.includes(tag.id);
};

// 切换标签选择状态
const toggleTag = (tag: { id: number }) => {
  const index = postForm.value.tags.indexOf(tag.id);
  if (index > -1) {
    postForm.value.tags.splice(index, 1);
  } else {
    if (postForm.value.tags.length < 3) {
      postForm.value.tags.push(tag.id);
    } else {
      showToast('最多选择3个标签');
    }
  }
};

// 返回上一页
const onClickLeft = () => {
  if (postForm.value.title || postForm.value.content || postForm.value.images.length > 0) {
    showDialog({
      title: '提示',
      message: '是否放弃编辑？',
      showCancelButton: true,
    }).then((action) => {
      if (action === 'confirm') {
        router.back();
      }
    });
  } else {
    router.back();
  }
};

// 图片上传前检查
const beforeRead = (file: File) => {
  // 检查文件类型
  const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
  if (!isImage) {
    showToast('请上传 jpg、png 或 gif 格式图片');
    return false;
  }
  // 检查文件大小（最大 5MB）
  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过 5MB');
    return false;
  }
  return true;
};

// 图片上传后处理
const afterRead = async (file: any) => {
  // 这里应该调用后端API上传图片
  // 示例代码，实际使用时需要改为真实的上传逻辑
  try {
    showToast.loading({
      message: '上传中...',
      forbidClick: true,
    });
    
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: 实现实际的图片上传逻辑
    file.url = URL.createObjectURL(file.file);
    
    showToast.success('上传成功');
  } catch (error) {
    showToast.fail('上传失败');
    console.error('图片上传失败:', error);
  }
};

// 删除图片前确认
const beforeDelete = () => {
  return new Promise((resolve) => {
    showDialog({
      title: '提示',
      message: '是否删除这张图片？',
      showCancelButton: true,
    }).then((action) => {
      resolve(action === 'confirm');
    });
  });
};

// 提交表单
const onSubmit = async () => {
  // 表单验证
  if (!postForm.value.title.trim()) {
    showToast('请输入标题');
    return;
  }
  if (!postForm.value.content.trim()) {
    showToast('请输入内容');
    return;
  }
  if (postForm.value.tags.length === 0) {
    showToast('请至少选择一个标签');
    return;
  }

  try {
    showToast.loading({
      message: '发布中...',
      forbidClick: true,
    });

    // TODO: 实现实际的发布逻辑
    await new Promise(resolve => setTimeout(resolve, 1000));

    showToast.success('发布成功');
    router.back();
  } catch (error) {
    showToast.fail('发布失败');
    console.error('发布失败:', error);
  }
};

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  try {
    const rawHtml = marked(postForm.value.content, {
      gfm: true,
      breaks: true,
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (error) {
            console.error('Highlight error:', error);
          }
        }
        return hljs.highlight(code, { language: 'plaintext' }).value;
      }
    });

    return DOMPurify.sanitize(rawHtml, {
      ADD_ATTR: ['target', 'class'],
      ADD_TAGS: ['iframe']
    });
  } catch (error) {
    console.error('Markdown渲染错误:', error);
    return '';
  }
});
</script>

<style scoped>
.post-create {
  min-height: 100vh;
  background: #f7f8fa;
}

.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #fff;
}

.nav-bar :deep(.back-button) {
  width: 100%;
}

.post-form {
  padding: 16px;
  margin-top: 8px;
}

.title-input {
  margin-bottom: 12px;
  background: #fff;
  border-radius: 8px;
}

.title-input :deep(.van-field__control) {
  font-size: 16px;
  font-weight: 500;
}

.content-input {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
}

.content-input :deep(.van-field__control) {
  font-size: 15px;
  line-height: 1.6;
}

.upload-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.tags-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #323233;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
}

.preview-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
}

.switch-label {
  font-size: 14px;
  color: #666;
}

.preview-section {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.preview-title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #323233;
}

.markdown-preview {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
}

/* Markdown 样式 */
.markdown-body {
  padding: 0 16px;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 { font-size: 2em; }
.markdown-body h2 { font-size: 1.5em; }
.markdown-body h3 { font-size: 1.25em; }
.markdown-body h4 { font-size: 1em; }
.markdown-body h5 { font-size: 0.875em; }
.markdown-body h6 { font-size: 0.85em; }

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-body pre code {
  padding: 0;
  background-color: transparent;
}

.markdown-body img {
  max-width: 100%;
  box-sizing: border-box;
}

.markdown-body blockquote {
  margin: 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body table {
  display: block;
  width: 100%;
  overflow: auto;
  margin-top: 0;
  margin-bottom: 16px;
  border-spacing: 0;
  border-collapse: collapse;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.submit-section {
  padding: 16px;
  margin-top: 20px;
  margin-bottom: 30px;
  background: #fff;
  border-radius: 8px;
}

.submit-btn {
  font-size: 16px;
  font-weight: 500;
  padding: 12px 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.2);
}
</style> 