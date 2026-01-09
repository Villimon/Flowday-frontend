import axios from 'axios';
import { TOKEN_LOCAL_STORAGE_KEY } from '../constants/localstorage';

export const $api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

$api.interceptors.request.use(config => {
    if (config.headers) {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
