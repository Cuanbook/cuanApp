export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getApiUrl = (endpoint: string): string => {
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 