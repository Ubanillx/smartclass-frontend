/**
 * QR码处理工具类
 */

export interface UserQRData {
  type: 'user_card';
  userId: number;
  userName?: string;
  timestamp: number;
}

export interface QRParseResult {
  success: boolean;
  type: 'user_card' | 'text' | 'url' | 'unknown';
  data?: UserQRData | { url: string } | { text: string };
  error?: string;
}

/**
 * 生成用户二维码数据
 */
export function generateUserQRData(userId: number, userName?: string): string {
  const qrData: UserQRData = {
    type: 'user_card',
    userId,
    userName,
    timestamp: Date.now()
  };
  
  return `smartclass://add_friend?data=${encodeURIComponent(JSON.stringify(qrData))}`;
}

/**
 * 解析QR码数据
 */
export function parseQRData(qrContent: string): QRParseResult {
  try {
    // 处理智云星课专用QR码
    if (qrContent.startsWith('smartclass://add_friend?data=')) {
      const dataParam = qrContent.split('data=')[1];
      if (!dataParam) {
        return {
          success: false,
          type: 'unknown',
          error: '二维码格式错误'
        };
      }

      const userData = JSON.parse(decodeURIComponent(dataParam));
      
      if (userData.type !== 'user_card' || !userData.userId) {
        return {
          success: false,
          type: 'unknown',
          error: '无效的用户二维码'
        };
      }

      return {
        success: true,
        type: 'user_card',
        data: userData
      };
    }
    
    // 处理其他智云星课QR码
    if (qrContent.startsWith('smartclass://')) {
      return {
        success: false,
        type: 'unknown',
        error: '暂不支持此类型的二维码'
      };
    }
    
    // 处理普通URL
    if (isValidURL(qrContent)) {
      return {
        success: true,
        type: 'url',
        data: { url: qrContent }
      };
    }
    
    // 处理普通文本
    return {
      success: true,
      type: 'text',
      data: { text: qrContent }
    };
    
  } catch (error) {
    return {
      success: false,
      type: 'unknown',
      error: '解析二维码失败: ' + (error as Error).message
    };
  }
}

/**
 * 验证是否为有效URL
 */
function isValidURL(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取QR码类型的显示名称
 */
export function getQRTypeDisplayName(type: string): string {
  switch (type) {
    case 'user_card':
      return '用户名片';
    case 'url':
      return '网址链接';
    case 'text':
      return '文本内容';
    default:
      return '未知类型';
  }
}

/**
 * 处理用户QR码扫描结果
 */
export function handleUserQRResult(qrData: UserQRData, currentUserId?: number): {
  success: boolean;
  message: string;
  action?: 'add_friend' | 'view_profile' | 'self';
  data?: UserQRData;
} {
  // 检查是否是自己的二维码
  if (currentUserId && qrData.userId === currentUserId) {
    return {
      success: false,
      message: '不能添加自己为好友',
      action: 'self'
    };
  }
  
  // 检查时间戳是否过期（可选，这里设置为24小时）
  const maxAge = 24 * 60 * 60 * 1000; // 24小时
  if (Date.now() - qrData.timestamp > maxAge) {
    console.warn('QR码时间戳较旧，但仍可使用');
  }
  
  return {
    success: true,
    message: '识别成功',
    action: 'add_friend',
    data: qrData
  };
} 