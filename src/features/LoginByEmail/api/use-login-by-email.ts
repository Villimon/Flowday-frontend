import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TOKEN_LOCAL_STORAGE_KEY, USER_ID_STORAGE_KEY } from '@/shared/constants/localstorage';
import { loginByEmail } from './login-by-email';
import { LoginRequestDto } from '../model/types/types';

export const useLoginByEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['login-action'],
        mutationFn: async (dto: LoginRequestDto) => {
            const data = await loginByEmail(dto);
            const { token, ...user } = data;
            localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token);

            if (import.meta.env.DEV && user) {
                localStorage.setItem(USER_ID_STORAGE_KEY, user?.id);
            }

            return user;
        },
        onSuccess: user => {
            queryClient.setQueryData(['user'], user);
        },
    });
};
