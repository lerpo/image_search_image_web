const { toString } = Object.prototype;

function getType(value: any): string {
  return toString.call(value).slice(8, -1).toLowerCase();
}

export function isPromise(value: any): boolean {
  const typeStr = getType(value);

  return typeStr === 'asyncfunction' || typeStr === 'promise';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isBlob(value: any): value is Blob {
  return getType(value) === 'blob';
}

export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isFile(value: any): value is File {
  return getType(value) === 'file';
}

export function isObject(value: any): value is object {
  return typeof value === 'object';
}

export function isPlainObject(value: any): value is object {
  return getType(value) === 'object';
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}
