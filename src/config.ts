export const BASE_URL: string =
  import.meta.env.VITE_BASE_URL ||
  (typeof process !== 'undefined' && process.env?.BASE_URL) ||
  'https://jsonplaceholder.typicode.com';
