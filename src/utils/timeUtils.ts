/**
 * 将日期格式化为相对时间（例如：刚刚、5分钟前、1小时前、昨天、前天、3天前等）
 * @param date 日期对象或可转换为日期的字符串
 * @returns 格式化后的相对时间字符串
 */
export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const targetDate = date instanceof Date ? date : new Date(date);
  
  // 计算时间差（毫秒）
  const diff = now.getTime() - targetDate.getTime();
  
  // 转换为秒
  const seconds = Math.floor(diff / 1000);
  
  // 不同时间单位的秒数
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  // 格式化时间
  if (seconds < 10) {
    return '刚刚';
  } else if (seconds < minute) {
    return `${seconds}秒前`;
  } else if (seconds < hour) {
    return `${Math.floor(seconds / minute)}分钟前`;
  } else if (seconds < day) {
    return `${Math.floor(seconds / hour)}小时前`;
  } else if (seconds < 2 * day) {
    return '昨天';
  } else if (seconds < 3 * day) {
    return '前天';
  } else if (seconds < week) {
    return `${Math.floor(seconds / day)}天前`;
  } else if (seconds < month) {
    return `${Math.floor(seconds / week)}周前`;
  } else if (seconds < year) {
    return `${Math.floor(seconds / month)}个月前`;
  } else {
    return `${Math.floor(seconds / year)}年前`;
  }
}

/**
 * 格式化日期为指定格式
 * @param date 日期对象或可转换为日期的字符串
 * @param format 格式化字符串，默认为'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = date instanceof Date ? date : new Date(date);
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  const pad = (n: number): string => n < 10 ? `0${n}` : `${n}`;
  
  return format
    .replace(/YYYY/g, `${year}`)
    .replace(/MM/g, pad(month))
    .replace(/DD/g, pad(day))
    .replace(/HH/g, pad(hours))
    .replace(/mm/g, pad(minutes))
    .replace(/ss/g, pad(seconds));
}

/**
 * 获取当天开始时间
 * @returns 当天开始时间的Date对象
 */
export function getStartOfDay(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 获取当天结束时间
 * @returns 当天结束时间的Date对象
 */
export function getEndOfDay(): Date {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
} 