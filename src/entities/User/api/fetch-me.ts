import { $api } from '@/shared/api/api';
import { TOKEN_LOCAL_STORAGE_KEY } from '@/shared/constants/localstorage';
import { UserDto } from '../model/types/types';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';

export const fetchMe = async () => {
    try {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
        if (!token) {
            return null;
        }

        const { data } = await $api.get<UserDto>('/auth/me');

        return data;
    } catch (e) {
        const error = e as AxiosError<ApiError>;
        throw error.response?.data || { success: false, message: 'Ошибка получения данных' };
    }
};
