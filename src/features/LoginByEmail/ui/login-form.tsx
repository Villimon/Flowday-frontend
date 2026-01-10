import { Button, Input, Text, VStack } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLoginByEmail } from '../api/use-login-by-email';
import { LoginFormData, loginSchema } from '../model/schema/schema';
import { toast } from 'react-toastify';

interface LoginFormProps {
    onClose: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onClose }) => {
    const { control, handleSubmit, reset } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    });

    const handleCloseModal = useCallback(() => {
        onClose();
        reset();
    }, [reset]);

    const {
        mutateAsync: loginMutate,
        error: mutationError,
        isPending: isLoggingIn,
        reset: resetMutation,
    } = useLoginByEmail();

    const isFormSubmitting = isLoggingIn;

    const handleLogin = useCallback(
        async (value: LoginFormData) => {
            resetMutation();
            loginMutate(value, {
                onSuccess: () => {
                    toast.success(`Вы успешно вошли!`);
                    handleCloseModal();
                },
            });
        },
        [loginMutate, resetMutation]
    );

    return (
        <form onSubmit={handleSubmit(handleLogin)}>
            <VStack gap="8" fullWidth>
                <VStack gap="4" fullWidth>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                placeholder="Введите вашу почту"
                                autoFocus
                                aria-required="true"
                                required
                                error={fieldState.error?.message}
                                isInvalid={!!fieldState.error}
                                label="Почта"
                                type="email"
                                autoComplete="email"
                                disabled={isFormSubmitting}
                                aria-describedby={
                                    fieldState.error ? 'email-error' : 'email-description'
                                }
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                placeholder="Введите пароль"
                                aria-required="true"
                                required
                                error={fieldState.error?.message}
                                isInvalid={!!fieldState.error}
                                label="Пароль"
                                type="password"
                                disabled={isFormSubmitting}
                                aria-describedby={
                                    fieldState.error ? 'password-error' : 'password-description'
                                }
                            />
                        )}
                    />
                    {mutationError && (
                        <Text variant="error" text={mutationError.message} size="sm" />
                    )}
                </VStack>
                <Button
                    loading={isFormSubmitting}
                    disabled={isFormSubmitting}
                    fullWidth
                    type="submit"
                >
                    Войти
                </Button>
            </VStack>
        </form>
    );
};
