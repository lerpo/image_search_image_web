import { STORAGE_TYPE } from '@/constants';
import { isString } from './type';

function getStorageType(type = STORAGE_TYPE.LOCAL) {
  return type === 'localStorage' ? window.localStorage : window.sessionStorage;
}

export function getItem<T = any>(key: string, type = STORAGE_TYPE.LOCAL): T | undefined {
  const storage = getStorageType(type);
  const rawValue = storage.getItem(key);

  if (!rawValue) {
    return;
  }

  const { value, parsed } = JSON.parse(rawValue);

  if (parsed) {
    return JSON.parse(value);
  }

  return value;
}

export function setItem<T = any>(key: string, value: T, type = STORAGE_TYPE.LOCAL) {
  const shouldParse = !isString(value);

  const storageVal = shouldParse ? {
    parsed: true,
    value: JSON.stringify(value),
  } : {
    parsed: false,
    value,
  }

  getStorageType(type).setItem(key, JSON.stringify(storageVal));
}

export function removeItem(key: string, type = STORAGE_TYPE.LOCAL) {
  getStorageType(type).removeItem(key);
}
