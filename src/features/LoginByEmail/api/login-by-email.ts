import { $api } from '@/shared/api/api';
import { LoginDto, LoginResponse } from '../model/types/types';

export const loginByEmail = async (dto: LoginDto) => {
    try {
        const { data } = await $api.post<LoginResponse>('/auth/login', dto);
        return data.data.token;
    } catch (e: any) {
        const serverMessage = e?.response?.data?.message || 'Ошибка авторизации';
        throw new Error(serverMessage);
    }
};
