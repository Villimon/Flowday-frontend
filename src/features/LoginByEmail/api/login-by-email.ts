import { $api } from '@/shared/api/api';
import { LoginRequestDto, LoginResponseDto } from '../model/types/types';

export const loginByEmail = async (dto: LoginRequestDto) => {
    try {
        const { data } = await $api.post<LoginResponseDto>('/auth/login', dto);
        return data.data.token;
    } catch (e: any) {
        const serverMessage = e?.response?.data?.message || 'Ошибка авторизации';
        throw new Error(serverMessage);
    }
};
