import { useMutation } from '@tanstack/react-query';
import { useLoginByEmail } from '@/features/LoginByEmail/api/use-login-by-email';
import { registerByEmail } from './register-by-email';

export const useRegisterByEmail = () => {
    const { mutateAsync } = useLoginByEmail();

    return useMutation({
        mutationFn: registerByEmail,
        onSuccess: async (_, variables) => {
            await mutateAsync({
                email: variables.email,
                password: variables.password,
            });
        },
    });
};
