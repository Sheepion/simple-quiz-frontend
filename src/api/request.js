import axios from 'axios';

// Create axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || 'http://localhost:8080',
  timeout: 5000
});

export default service;
