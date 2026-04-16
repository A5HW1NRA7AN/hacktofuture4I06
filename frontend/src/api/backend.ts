import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/v1';

export const backendApi = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach Authorization header
backendApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback logic for Demo Safety (if Backend is unreachable/empty response)
backendApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only use mock fallbacks if explicitly enabled via environment variable
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      console.warn('[Backend] Django API Failed/Unreachable. Using demo fallbacks.', error.config?.url);
      
      // Auto-mocking for demo purposes
      if (error.config?.url?.includes('/auth/login')) {
        return {
          data: {
            access: 'demo-ey-token',
            user: { id: 'user-1', email: 'demo@voxbridge.test', first_name: 'Demo', last_name: 'User', is_active: true }
          }
        };
      }
      
      if (error.config?.url?.includes('/chat/sessions')) {
        return {
          data: [
            { id: 'session-1', title: 'Standup Updates', created_at: new Date().toISOString() },
            { id: 'session-2', title: 'Payment bug investigation', created_at: new Date(Date.now() - 86400000).toISOString() }
          ]
        };
      }

      if (error.config?.url?.includes('/integrations')) {
        return {
          data: [
            { id: 1, provider: 'jira', is_active: true },
            { id: 2, provider: 'slack', is_active: false },
            { id: 3, provider: 'linear', is_active: false }
          ]
        };
      }
    }

    return Promise.reject(error);
  }
);
