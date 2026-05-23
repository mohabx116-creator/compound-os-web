import axios from 'axios';

export const apiClient = axios.create({
  // Mock-first phase: pages must not call the real backend yet.
  // Set VITE_API_BASE_URL during the backend integration phase.
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/mock-api-disabled',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach authorization tokens to request headers in future iterations
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
