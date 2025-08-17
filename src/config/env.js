// Centralized environment variable access.
// All public Vite vars must be prefixed with VITE_.

const api = import.meta.env.VITE_API_BASE_URL;
const files = import.meta.env.VITE_FILES_BASE_URL || api?.replace(/\/api$/, '') || '';

export const API_BASE_URL = api?.replace(/\/$/, '');
export const FILES_BASE_URL = files.replace(/\/$/, '');

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('[env] VITE_API_BASE_URL is not defined. API calls will fail until it is set.');
}
