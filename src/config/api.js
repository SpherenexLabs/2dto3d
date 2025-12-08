// Configuration for API endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const config = {
  apiUrl: API_BASE_URL,
  endpoints: {
    upload: `${API_BASE_URL}/api/upload`,
    analyze: `${API_BASE_URL}/api/analyze`,
    templates: `${API_BASE_URL}/api/templates`,
    scenes: `${API_BASE_URL}/api/scenes`,
  }
};
