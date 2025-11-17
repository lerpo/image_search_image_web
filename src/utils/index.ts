import { isString } from './type';

// 千分位
export function formatNumber(num: unknown) {
  if (typeof num !== 'number') {
    return '0';
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 过滤特殊符号
export function filterSpecialChars(value: any) {
  if (!isString(value)) {
    return '';
  }

  return value.replace(/[^\u4e00-\u9fa5\w\'\-\_\.]/g, '');
}

// 校验手机号
export function validatePhone(value: string) {
  if (!isString(value)) {
    return false;
  }

  return /^1[3-9]\d{9}$/.test(value);
}
