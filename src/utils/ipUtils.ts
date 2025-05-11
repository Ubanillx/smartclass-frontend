/**
 * IP地址工具函数
 */

/**
 * 获取用户IP地址
 * 使用第三方API获取客户端IP地址
 * @returns {Promise<string>} 返回IP地址
 */
export async function getClientIP(): Promise<string> {
  try {
    // 使用免费API获取IP信息
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('获取IP地址失败:', error);
    // 无法获取IP时返回空字符串
    return '';
  }
}

/**
 * 获取用户IP地址(备用方法)
 * 使用备用API获取IP地址
 * @returns {Promise<string>} 返回IP地址
 */
export async function getClientIPBackup(): Promise<string> {
  try {
    // 备用API
    const response = await fetch('https://api.ip.sb/ip');
    const ip = await response.text();
    return ip.trim();
  } catch (error) {
    console.error('获取IP地址失败(备用):', error);
    return '';
  }
}

/**
 * 获取用户IP地址(带失败重试)
 * 尝试使用多个API获取IP地址，提高成功率
 * @returns {Promise<string>} 返回IP地址
 */
export async function getClientIPWithRetry(): Promise<string> {
  try {
    // 首先尝试主要方法
    const ip = await getClientIP();
    if (ip) return ip;
    
    // 如果主要方法失败，尝试备用方法
    const backupIp = await getClientIPBackup();
    return backupIp;
  } catch (error) {
    console.error('获取IP地址失败(所有方法):', error);
    return '';
  }
} 