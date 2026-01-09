import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TOKEN_LOCAL_STORAGE_KEY } from '@/shared/constants/localstorage';
import { loginByEmail } from './login-by-email';

export const useLoginByEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginByEmail,
        onSuccess: data => {
            localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, data.token);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};
