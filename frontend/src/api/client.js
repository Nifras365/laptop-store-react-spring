import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach token if exists
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: handle 401/403 by clearing auth and redirecting
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userID');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
