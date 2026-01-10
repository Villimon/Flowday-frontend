import { Button, Input, Text, VStack } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { registerSchema, RegisterFormData } from '../model/schema/schema';
import { useRegisterByEmail } from '../api/use-register-by-email';

interface RegisterFormProps {
    onClose: () => void;
}

export const RegisterForm: FC<RegisterFormProps> = ({ onClose }) => {
    const { control, handleSubmit, reset } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    });

    const handleCloseModal = useCallback(() => {
        reset();
        onClose();
    }, [reset]);

    const {
        mutateAsync: registerMutate,
        error: registerError,
        isPending: isRegisteringIn,
        reset: resetMutation,
    } = useRegisterByEmail();

    const isFormSubmitting = isRegisteringIn;

    const handleLogin = useCallback(
        async (value: RegisterFormData) => {
            resetMutation();
            registerMutate(value, {
                onSuccess: () => {
                    toast.success(`Вы успешно зарегистрировались!`);
                    handleCloseModal();
                },
            });
        },
        [registerMutate, resetMutation]
    );

    return (
        <form onSubmit={handleSubmit(handleLogin)}>
            <VStack gap="8" fullWidth>
                <VStack gap="4" fullWidth>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                placeholder="Введите ваше имя"
                                autoFocus
                                aria-required="true"
                                required
                                error={fieldState.error?.message}
                                isInvalid={!!fieldState.error}
                                label="Имя"
                                autoComplete="name"
                                disabled={isFormSubmitting}
                                aria-describedby={
                                    fieldState.error ? 'name-error' : 'name-description'
                                }
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                placeholder="Введите вашу почту"
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
                    {registerError && (
                        <Text variant="error" text={registerError.message} size="sm" />
                    )}
                </VStack>
                <Button
                    loading={isFormSubmitting}
                    disabled={isFormSubmitting}
                    fullWidth
                    type="submit"
                >
                    Зарегистроваться
                </Button>
            </VStack>
        </form>
    );
};
