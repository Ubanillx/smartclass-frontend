/**
 * 格式化日期为相对时间或标准格式
 * @param dateString 日期字符串
 * @returns 格式化后的日期
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // 时间差（毫秒）
  const diff = now.getTime() - date.getTime();
  
  // 不同时间单位的毫秒数
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;
  
  // 根据时间差决定显示方式
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前';
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前';
  } else if (diff < 2 * day) {
    return '昨天';
  } else if (diff < 3 * day) {
    return '前天';
  } else if (diff < 7 * day) {
    return Math.floor(diff / day) + '天前';
  } else if (diff < month) {
    return Math.floor(diff / (7 * day)) + '周前';
  } else if (diff < year) {
    return Math.floor(diff / month) + '个月前';
  } else {
    // 超过一年则显示完整日期
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
  }
}

/**
 * 数字补零
 * @param num 需要补零的数字
 * @returns 补零后的字符串
 */
function padZero(num: number): string {
  return num < 10 ? '0' + num : num.toString();
} 