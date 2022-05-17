export const isString = (value: any): boolean => {
  return typeof value === 'string' || value instanceof String;
};

export const isNumber = (value: any): boolean => {
  return typeof value === 'number' && isFinite(value);
};

export const isArray = (value: any): boolean => {
  return value && typeof value === 'object' && value.constructor === Array;
};

export const isFunction = (value: any): boolean => {
  return typeof value === 'function';
};

export const isObject = (value: any): boolean => {
  return value && typeof value === 'object' && value.constructor === Object;
};

export const isSingleObject = (value: any) => {
  return value && typeof value === 'object' && value._doc;
};

export const isNull = (value: any): boolean => {
  return value === null;
};

export const isUndefined = (value: any): boolean => {
  return typeof value === 'undefined';
};

export const isBoolean = (value: any): boolean => {
  return typeof value === 'boolean';
};

export const isRegExp = (value: any): boolean => {
  return value && typeof value === 'object' && value.constructor === RegExp;
};

export const isError = (value: any): boolean => {
  return value instanceof Error && typeof value.message !== 'undefined';
};

export const isDate = (value: any): boolean => {
  return value instanceof Date;
};

export const isSymbol = (value: any): boolean => {
  return typeof value === 'symbol';
};

export const getDataType = (value: any): boolean => {
  return typeof value === 'symbol';
};
