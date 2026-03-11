import { Button, Input, Text, VStack } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLoginByEmail } from '../api/use-login-by-email';
import { LoginFormData, loginSchema } from '../model/schema/schema';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getRouteTodos } from '@/shared/constants/router';

interface LoginFormProps {
    onClose: () => void;
    isRedirect?: boolean;
}

export const LoginForm: FC<LoginFormProps> = ({ onClose, isRedirect = false }) => {
    const ref = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

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

    const handleLogin = useCallback(
        (value: LoginFormData) => {
            resetMutation();
            loginMutate(value, {
                onSuccess: () => {
                    toast.success(`Вы успешно вошли!`);
                    handleCloseModal();
                    if (isRedirect) {
                        navigate(getRouteTodos());
                    }
                },
                onError: error => {
                    toast.error(error.message || 'Ошибка при авторизации');
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
                                ref={ref}
                                placeholder="Введите вашу почту"
                                autoFocus
                                aria-required="true"
                                required
                                error={fieldState.error?.message}
                                isInvalid={!!fieldState.error}
                                label="Почта"
                                type="email"
                                autoComplete="email"
                                disabled={isLoggingIn}
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
                                disabled={isLoggingIn}
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
                <Button loading={isLoggingIn} disabled={isLoggingIn} fullWidth type="submit">
                    Войти
                </Button>
            </VStack>
        </form>
    );
};
