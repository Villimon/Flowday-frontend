import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TOKEN_LOCAL_STORAGE_KEY, USER_ID_STORAGE_KEY } from '@/shared/constants/localstorage';
import { loginByEmail } from './login-by-email';
import { LoginRequestDto } from '../model/types/types';
import { fetchMe } from '@/entities/User';

export const useLoginByEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: LoginRequestDto) => {
            const token = await loginByEmail(dto);
            localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token);

            const user = await fetchMe();

            if (import.meta.env.DEV && user) {
                localStorage.setItem(USER_ID_STORAGE_KEY, user?.data.id);
            }

            return user;
        },
        onSuccess: user => {
            queryClient.setQueryData(['user'], user);
        },
    });
};
