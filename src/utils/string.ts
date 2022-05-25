export const isJson = (s: string): boolean => {
  try {
    return !!JSON.parse(s);
  } catch (e) {
    return false;
  }
};
