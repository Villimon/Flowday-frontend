import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerByEmail } from './register-by-email';
import { RegisterDto } from '../model/types/types';
import { TOKEN_LOCAL_STORAGE_KEY, USER_ID_STORAGE_KEY } from '@/shared/constants/localstorage';

export const useRegisterByEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['register-action'],
        mutationFn: async (dto: RegisterDto) => {
            const data = await registerByEmail(dto);
            const { token, ...user } = data.data;
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
