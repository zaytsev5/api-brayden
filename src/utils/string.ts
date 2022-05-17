export const removeNewLines = (s: string): string => {
  return s.replace(/\r?\n?/g, '');
};

export const tryParseFloat = (s: string): number => {
  try {
    return parseFloat(s);
  } catch (e) {
    return 0;
  }
};

export const tryParseInt = (s: string): number => {
  try {
    return parseInt(s, 10);
  } catch (e) {
    return 0;
  }
};

export const isJson = (s: string): boolean => {
  try {
    return !!JSON.parse(s);
  } catch (e) {
    return false;
  }
};
