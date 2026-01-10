import { $api } from '@/shared/api/api';
import { RegisterDto, RegisterResponse } from '../model/types/types';

export const registerByEmail = async (dto: RegisterDto) => {
    try {
        await $api.post<RegisterResponse>('/auth/register', dto);
    } catch (e: any) {
        const serverMessage = e?.response?.data?.message || 'Ошибка регистрации';
        throw new Error(serverMessage);
    }
};
