import axios from 'axios';

// Diagnóstico do ambiente Vite
const env = import.meta?.env || {};
console.log('🔧 Vite env:', { DEV: env.DEV, MODE: env.MODE, VITE_API_BASE_URL: env.VITE_API_BASE_URL });

// Base URL da API
// Regra: sempre prioriza VITE_API_BASE_URL; se ausente, cai para localhost:5000/api
const baseURL = env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', baseURL);

const api = axios.create({ baseURL });

export default api;
