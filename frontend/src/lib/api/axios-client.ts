import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from '@/config';
import { STORAGE_KEYS } from '@/constants';

const axiosClient: AxiosInstance = axios.create({
    baseURL: APP_CONFIG.API_URL,
    timeout: APP_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies with requests
});

// Request Interceptor
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // No need to manually attach token with cookies
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosClient.interceptors.response.use(
    (response) => {
        const res = response.data;
        // Automatically extract data if wrapped by TransformInterceptor
        if (res && typeof res === 'object' && res.success === true && 'data' in res) {
            return res.data;
        }
        return res;
    },
    (error: AxiosError) => {
        // Handle common errors like 401, 403, 500
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data as Record<string, unknown>;

            if (status === 401) {
                // Auto logout if 401 Unauthorized
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
                    // location.href = ROUTES.LOGIN; // Optional redirect
                }
            }

            return Promise.reject({
                message: data?.message || 'Có lỗi xảy ra',
                status: status,
                code: data?.code || 'ERROR'
            });
        }

        if (error.request) {
            return Promise.reject({
                message: 'Không thể kết nối đến server',
                status: 503,
                code: 'NETWORK_ERROR'
            });
        }

        return Promise.reject({
            message: error.message || 'Lỗi không xác định',
            status: 500,
            code: 'UNKNOWN_ERROR'
        });
    }
);

export default axiosClient;
