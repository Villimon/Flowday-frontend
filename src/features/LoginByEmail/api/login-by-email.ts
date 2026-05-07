import { $api } from '@/shared/api/api';
import { LoginRequestDto, LoginResponseDto } from '../model/types/types';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';

export const loginByEmail = async (dto: LoginRequestDto) => {
    try {
        const { data } = await $api.post<LoginResponseDto>('/auth/login', dto);
        return data.data;
    } catch (e) {
        const error = e as AxiosError<ApiError>;
        throw error.response?.data || { success: false, message: 'Ошибка авторизации' };
    }
};
