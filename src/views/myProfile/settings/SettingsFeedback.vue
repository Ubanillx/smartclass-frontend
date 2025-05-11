<template>
  <div class="feedback-page">
    <back-button title="用户反馈" />

    <van-form class="feedback-form" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="feedbackForm.title"
          name="title"
          label="标题"
          placeholder="请输入反馈标题"
          :rules="[{ required: true, message: '请填写反馈标题' }]"
        />
        
        <van-field
          v-model="feedbackForm.feedbackType"
          name="feedbackType"
          label="反馈类型"
          readonly
          is-link
          placeholder="请选择反馈类型"
          :rules="[{ required: true, message: '请选择反馈类型' }]"
          @click="showTypePicker = true"
        />
        
        <van-field
          v-model="feedbackForm.content"
          name="content"
          label="反馈内容"
          type="textarea"
          placeholder="请详细描述您的问题或建议"
          :rules="[{ required: true, message: '请填写反馈内容' }]"
          rows="5"
          maxlength="500"
          show-word-limit
        />
        
        <van-field
          name="attachment"
          label="附件"
        >
          <template #input>
            <div class="attachment-upload">
              <van-uploader
                v-model="fileList"
                :max-count="1"
                :max-size="5 * 1024 * 1024"
                :after-read="afterRead"
                @oversize="onOversize"
                @delete="onDeleteFile"
                :preview-size="64"
              >
                <template #preview-cover="{ file }">
                  <div class="preview-cover" v-if="file.status === 'uploading'">
                    <van-loading type="spinner" size="20" />
                    <span class="upload-message">{{ file.message }}</span>
                  </div>
                </template>
                <template #default>
                  <div class="upload-placeholder">
                    <van-icon name="plus" size="22" />
                  </div>
                </template>
              </van-uploader>
              <div class="upload-tip" v-if="fileList.length === 0">
                <span>上传附件（可选，最大5MB）</span>
              </div>
            </div>
          </template>
        </van-field>
      </van-cell-group>
      
      <div class="submit-btn">
        <van-button 
          round 
          block 
          type="primary" 
          native-type="submit"
          :loading="isSubmitting"
        >
          提交反馈
        </van-button>
      </div>
    </van-form>
    
    <van-popup
      v-model:show="showTypePicker"
      position="bottom"
      round
    >
      <van-picker
        title="选择反馈类型"
        :columns="feedbackTypes.map(type => ({ text: type, value: type }))"
        @confirm="onTypeConfirm"
        @cancel="showTypePicker = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 历史反馈列表 -->
    <div class="history-list" v-if="historyFeedbacks.length > 0">
      <div class="history-title">历史反馈</div>
      <van-cell-group inset v-for="item in historyFeedbacks" :key="item.id">
        <van-cell :title="item.title">
          <template #value>
            <span :class="['status', getStatusClass(item.status)]">{{getStatusText(item.status)}}</span>
          </template>
        </van-cell>
        <van-cell title="反馈类型">
          <template #value>
            <span>{{item.feedbackType}}</span>
          </template>
        </van-cell>
        <van-cell title="内容">
          <template #value>
            <span class="content-preview">{{item.content}}</span>
          </template>
        </van-cell>
        <van-cell title="提交时间">
          <template #value>
            <span>{{formatDate(item.createTime)}}</span>
          </template>
        </van-cell>
        <van-cell>
          <template #default>
            <div class="detail-btn-container">
              <van-button 
                size="small" 
                type="primary" 
                plain 
                @click="viewFeedbackDetail(item)"
              >
                查看详情
              </van-button>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    
    <div class="loading-container" v-if="isLoading">
      <van-loading type="spinner" color="#1989fa" />
    </div>
    
    <div class="empty-container" v-if="!isLoading && historyFeedbacks.length === 0">
      <van-empty description="暂无历史反馈" />
    </div>

    <!-- 反馈详情弹窗 -->
    <van-popup
      v-model:show="showDetailPopup"
      position="bottom"
      round
      :style="{ height: '80%' }"
      closeable
    >
      <div class="detail-popup">
        <div class="detail-header">
          <h3 class="detail-title">反馈详情</h3>
        </div>
        
        <div class="detail-content" v-if="currentFeedback">
          <div class="detail-section">
            <div class="detail-item">
              <div class="detail-label">标题</div>
              <div class="detail-value">{{ currentFeedback.title }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">反馈类型</div>
              <div class="detail-value">{{ currentFeedback.feedbackType }}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">状态</div>
              <div class="detail-value">
                <span :class="['status', getStatusClass(currentFeedback.status)]">
                  {{ getStatusText(currentFeedback.status) }}
                </span>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">提交时间</div>
              <div class="detail-value">{{ formatDate(currentFeedback.createTime) }}</div>
            </div>
            
            <div class="detail-item content-item">
              <div class="detail-label">反馈内容</div>
              <div class="detail-value content-full">{{ currentFeedback.content }}</div>
            </div>
            
            <div class="detail-item" v-if="currentFeedback.attachment">
              <div class="detail-label">附件</div>
              <div class="detail-value">
                <a :href="currentFeedback.attachment" target="_blank" class="attachment-link">
                  <van-icon name="description" class="attachment-icon" /> 查看附件
                </a>
              </div>
            </div>
          </div>
          
          <!-- 管理员回复区域 -->
          <div class="admin-reply-section" v-if="feedbackReplies.length > 0">
            <div class="section-divider"></div>
            <div class="admin-reply-header">沟通记录</div>
            
            <div class="reply-list">
              <div class="reply-item" v-for="reply in feedbackReplies" :key="reply.id">
                <div class="reply-sender-info">
                  <span class="reply-sender">{{ getSenderName(reply) }}</span>
                  <span class="reply-time">{{ formatDate(reply.createTime) }}</span>
                </div>
                <div class="reply-content">{{ reply.content }}</div>
                <div v-if="reply.attachment" class="reply-attachment">
                  <a :href="reply.attachment" target="_blank" class="attachment-link">
                    <van-icon name="description" class="attachment-icon" /> 查看附件
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 无回复提示 -->
          <div class="no-reply" v-else>
            <van-empty description="暂无回复" />
          </div>
          
          <!-- 用户继续回复区域 -->
          <div class="user-reply-section">
            <div class="section-divider" v-if="feedbackReplies.length === 0"></div>
            <div class="reply-form">
              <van-field
                v-model="replyForm.content"
                type="textarea"
                placeholder="继续反馈更多信息..."
                rows="3"
                :autosize="{ minHeight: 60, maxHeight: 120 }"
                maxlength="500"
                show-word-limit
              />
              
              <div class="reply-upload-area">
                <van-uploader
                  v-model="replyFileList"
                  :max-count="1"
                  :max-size="5 * 1024 * 1024"
                  :after-read="afterReplyAttachmentUpload"
                  @oversize="onOversize"
                  @delete="onDeleteReplyFile"
                  :preview-size="64"
                >
                  <template #default>
                    <div class="upload-btn">
                      <van-icon name="description" class="upload-icon" />
                      <span>附件</span>
                    </div>
                  </template>
                </van-uploader>
                
                <div class="send-btn-container">
                  <van-button 
                    type="primary" 
                    size="small" 
                    :loading="isSubmittingReply"
                    :disabled="!replyForm.content"
                    @click="submitReply"
                    class="send-btn"
                  >
                    发送
                  </van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="loading-container" v-if="isLoadingDetail">
          <van-loading type="spinner" color="#1989fa" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { showToast, showDialog, type UploaderFileListItem } from 'vant';
import { BackButton } from '../../../components/Common';
import { UserFeedbackControllerService, FileControllerService, UserFeedbackReplyControllerService } from '../../../services';
import type { UserFeedback, UserFeedbackAddRequest, UserFeedbackReplyVO } from '../../../services';

// 表单数据
const feedbackForm = ref<UserFeedbackAddRequest>({
  title: '',
  content: '',
  feedbackType: '',
  attachment: '',
});

// 文件上传列表
const fileList = ref<UploaderFileListItem[]>([]);

// 反馈类型选择器
const showTypePicker = ref(false);
const feedbackTypes = ['功能建议', '内容反馈', '错误报告', '其他问题'];

// 状态
const isSubmitting = ref(false);
const isLoading = ref(false);
const isLoadingDetail = ref(false);
const showDetailPopup = ref(false);
const isSubmittingReply = ref(false);

// 历史反馈列表
const historyFeedbacks = ref<UserFeedback[]>([]);
const currentFeedback = ref<UserFeedback | null>(null);
const feedbackReplies = ref<UserFeedbackReplyVO[]>([]);

// 回复表单
const replyForm = ref({
  content: '',
  attachment: '',
});
const replyFileList = ref<UploaderFileListItem[]>([]);

// 获取历史反馈
const fetchFeedbackHistory = async () => {
  isLoading.value = true;
  try {
    const response = await UserFeedbackControllerService.listUserFeedbackByPageUsingPost({
      current: 1,
      pageSize: 10,
      sortField: 'createTime',
      sortOrder: 'descend',
    });
    
    if (response.code === 0 && response.data && response.data.records) {
      historyFeedbacks.value = response.data.records;
    }
  } catch (error) {
    console.error('获取历史反馈失败:', error);
    showToast('获取历史反馈失败，请稍后再试');
  } finally {
    isLoading.value = false;
  }
};

// 处理类型选择
const onTypeConfirm = (value: { selectedValues: string[] }) => {
  feedbackForm.value.feedbackType = value.selectedValues[0];
  showTypePicker.value = false;
};

// 处理文件上传
const afterRead = async (file: UploaderFileListItem) => {
  if (!file.file) {
    showToast('文件读取失败');
    return;
  }
  
  // 显示上传中状态
  file.status = 'uploading';
  file.message = '上传中...';
  
  try {
    // 调用文件上传API
    const response = await FileControllerService.uploadFileUsingPost(
      file.file,
      undefined,
      'feedback', // 业务标识
      '用户反馈附件',
      file.file.name
    );
    
    if (response.code === 0 && response.data) {
      // 上传成功，设置状态
      file.status = 'done';
      file.message = '上传成功';
      
      // 将返回的URL保存到表单中
      feedbackForm.value.attachment = response.data;
    } else {
      // 上传失败
      file.status = 'failed';
      file.message = response.message || '上传失败';
      showToast(`文件上传失败: ${response.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('文件上传失败:', error);
    file.status = 'failed';
    file.message = '上传失败';
    showToast('文件上传失败，请稍后再试');
  }
};

// 文件超出大小限制提示
const onOversize = () => {
  showToast('文件大小不能超过5MB');
};

// 提交表单
const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const response = await UserFeedbackControllerService.addUserFeedbackUsingPost(
      feedbackForm.value
    );
    
    if (response.code === 0) {
      showToast('反馈提交成功');
      // 重置表单
      feedbackForm.value = {
        title: '',
        content: '',
        feedbackType: '',
        attachment: '',
      };
      fileList.value = [];
      // 刷新历史反馈列表
      fetchFeedbackHistory();
    } else {
      showToast(`提交失败: ${response.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('提交反馈失败:', error);
    showToast('提交失败，请稍后再试');
  } finally {
    isSubmitting.value = false;
  }
};

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知时间';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 获取状态文本
const getStatusText = (status?: number) => {
  if (status === undefined) return '未知';
  switch (status) {
    case 0: return '待处理';
    case 1: return '处理中';
    case 2: return '已解决';
    case 3: return '已关闭';
    default: return '未知';
  }
};

// 获取状态样式类
const getStatusClass = (status?: number) => {
  if (status === undefined) return 'status-unknown';
  switch (status) {
    case 0: return 'status-pending';
    case 1: return 'status-processing';
    case 2: return 'status-resolved';
    case 3: return 'status-closed';
    default: return 'status-unknown';
  }
};

// 文件删除处理
const onDeleteFile = () => {
  // 清除表单中的附件URL
  feedbackForm.value.attachment = '';
};

// 查看反馈详情
const viewFeedbackDetail = async (feedback: UserFeedback) => {
  currentFeedback.value = feedback;
  showDetailPopup.value = true;
  await fetchFeedbackReplies(feedback.id);
};

// 获取反馈回复列表
const fetchFeedbackReplies = async (feedbackId?: number) => {
  if (!feedbackId) return;
  
  isLoadingDetail.value = true;
  feedbackReplies.value = [];
  
  try {
    const response = await UserFeedbackReplyControllerService.listRepliesUsingGet(feedbackId);
    
    if (response.code === 0 && response.data) {
      feedbackReplies.value = response.data;
      
      // 标记所有未读回复为已读
      response.data.forEach(reply => {
        if (reply.isRead === 0 && reply.id) {
          UserFeedbackReplyControllerService.markAsReadUsingPost(reply.id);
        }
      });
    }
  } catch (error) {
    console.error('获取反馈回复失败:', error);
    showToast('获取反馈回复失败，请稍后再试');
  } finally {
    isLoadingDetail.value = false;
  }
};

// 获取发送者名称
const getSenderName = (reply: UserFeedbackReplyVO) => {
  if (reply.senderRole === 1) {
    return '管理员';
  } else if (reply.sender && reply.sender.userName) {
    return reply.sender.userName;
  } else {
    return '未知用户';
  }
};

// 处理回复文件上传
const afterReplyAttachmentUpload = async (file: UploaderFileListItem) => {
  if (!file.file) {
    showToast('文件读取失败');
    return;
  }
  
  // 显示上传中状态
  file.status = 'uploading';
  file.message = '上传中...';
  
  try {
    // 调用文件上传API
    const response = await FileControllerService.uploadFileUsingPost(
      file.file,
      undefined,
      'feedback-reply', // 业务标识
      '用户反馈回复附件',
      file.file.name
    );
    
    if (response.code === 0 && response.data) {
      // 上传成功，设置状态
      file.status = 'done';
      file.message = '上传成功';
      
      // 将返回的URL保存到表单中
      replyForm.value.attachment = response.data;
    } else {
      // 上传失败
      file.status = 'failed';
      file.message = response.message || '上传失败';
      showToast(`文件上传失败: ${response.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('文件上传失败:', error);
    file.status = 'failed';
    file.message = '上传失败';
    showToast('文件上传失败，请稍后再试');
  }
};

// 删除回复文件
const onDeleteReplyFile = () => {
  replyForm.value.attachment = '';
};

// 提交回复
const submitReply = async () => {
  if (!currentFeedback.value || !currentFeedback.value.id) {
    showToast('反馈信息无效');
    return;
  }
  
  if (!replyForm.value.content.trim()) {
    showToast('请输入回复内容');
    return;
  }
  
  isSubmittingReply.value = true;
  
  try {
    const response = await UserFeedbackReplyControllerService.addReplyUsingPost({
      feedbackId: currentFeedback.value.id,
      content: replyForm.value.content,
      attachment: replyForm.value.attachment
    });
    
    if (response.code === 0) {
      showToast('回复成功');
      
      // 清空回复表单
      replyForm.value.content = '';
      replyForm.value.attachment = '';
      replyFileList.value = [];
      
      // 重新获取回复列表
      await fetchFeedbackReplies(currentFeedback.value.id);
    } else {
      showToast(`回复失败: ${response.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('提交回复失败:', error);
    showToast('回复失败，请稍后再试');
  } finally {
    isSubmittingReply.value = false;
  }
};

// 页面加载时获取历史反馈
onMounted(() => {
  fetchFeedbackHistory();
});
</script>

<style scoped>
.feedback-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 30px;
}

.feedback-form {
  margin-top: 16px;
}

.submit-btn {
  margin: 30px 16px;
}

.attachment-upload {
  display: flex;
  flex-direction: column;
}

.upload-tip {
  margin-top: 8px;
  color: #969799;
  font-size: var(--font-size-sm);
}

.format-tip {
  margin-top: 4px;
  color: #969799;
  font-size: var(--font-size-sm);
}

.preview-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 4px;
}

.upload-message {
  margin-top: 6px;
  font-size: var(--font-size-sm);
}

.history-list {
  margin-top: 24px;
}

.history-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 16px 8px;
  color: #323233;
}

.loading-container, .empty-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.content-preview {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.status-pending {
  color: #ff976a;
  background-color: #fff7e6;
}

.status-processing {
  color: #1989fa;
  background-color: #e6f7ff;
}

.status-resolved {
  color: #07c160;
  background-color: #e8fff3;
}

.status-closed {
  color: #969799;
  background-color: #f2f3f5;
}

.status-unknown {
  color: #969799;
  background-color: #f2f3f5;
}

.upload-placeholder {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f8fa;
  border-radius: 4px;
  color: #969799;
  border: 1px dashed #dcdee0;
}

.detail-btn-container {
  display: flex;
  justify-content: flex-end;
}

.detail-popup {
  padding: 20px;
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
}

.detail-header {
  margin-bottom: 20px;
  text-align: center;
  position: relative;
}

.detail-title {
  font-size: var(--font-size-lg);
  font-weight: 500;
  margin: 0;
  color: #323233;
}

.detail-label {
  font-size: var(--font-size-md);
  color: #969799;
  margin-bottom: 4px;
}

.detail-value {
  font-size: var(--font-size-md);
  color: #323233;
  margin-bottom: 12px;
  word-break: break-word;
}

.content-item {
  margin-top: 8px;
}

.content-full {
  white-space: pre-wrap;
  line-height: 1.5;
}

.section-divider {
  height: 8px;
  background-color: #f5f5f5;
  margin: 16px -20px;
}

.admin-reply-header {
  font-size: var(--font-size-lg);
  font-weight: 500;
  margin: 16px 0;
  color: #323233;
}

.reply-list {
  margin-bottom: 16px;
}

.reply-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-sender-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.reply-sender {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #323233;
}

.reply-time {
  font-size: var(--font-size-sm);
  color: #969799;
}

.reply-content {
  font-size: var(--font-size-md);
  color: #323233;
  line-height: 1.5;
  margin-bottom: 8px;
}

.reply-attachment {
  margin-top: 8px;
}

.attachment-link {
  display: flex;
  align-items: center;
  font-size: var(--font-size-md);
  color: #1989fa;
  text-decoration: none;
}

.attachment-icon {
  margin-right: 4px;
  font-size: 16px;
}

.status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: var(--font-size-sm);
}

.no-reply {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.admin-reply-section {
  background-color: #fff;
}

.reply-item {
  position: relative;
}

.reply-form {
  margin-top: 16px;
  position: relative;
  background-color: #fff;
  border-radius: 8px;
}

.reply-upload-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 0 2px;
}

.upload-btn {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #ecf9ff;
  border-radius: 4px;
  color: #1989fa;
  border: 1px solid #d0e8ff;
}

.upload-icon {
  margin-right: 6px;
  font-size: 16px;
  color: #1989fa;
}

.send-btn-container {
  display: flex;
  justify-content: flex-end;
}

.send-btn {
  padding: 0 16px;
  height: 32px;
  border-radius: 16px;
}

/* 添加弹窗关闭按钮样式 */
:deep(.van-popup__close-icon) {
  color: #969799;
  font-size: 18px;
}
</style> 