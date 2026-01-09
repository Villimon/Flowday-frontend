import { $api } from '@/shared/api/api';
import { TOKEN_LOCAL_STORAGE_KEY } from '@/shared/constants/localstorage';
import { useQuery } from '@tanstack/react-query';
import { UserDto } from '../model/types/types';

export const useAuth = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
                if (!token) {
                    return null;
                }

                const { data } = await $api.get<UserDto>('/auth/me');

                return data;
            } catch (e: any) {
                const serverMessage = e?.response?.data?.message || 'Ошибка получение данных';
                throw new Error(serverMessage);
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};
