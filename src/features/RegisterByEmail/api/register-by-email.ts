import { $api } from '@/shared/api/api';
import { RegisterDto, RegisterResponse } from '../model/types/types';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';

export const registerByEmail = async (dto: RegisterDto) => {
    try {
        await $api.post<RegisterResponse>('/auth/register', dto);
    } catch (e) {
        const error = e as AxiosError<ApiError>;
        throw error.response?.data || { success: false, message: 'Ошибка регистрации' };
    }
};
