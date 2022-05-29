export function randomCode(limit: number) {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2)).slice(-limit).toLocaleUpperCase();
}
