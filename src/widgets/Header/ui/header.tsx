import { memo, useCallback } from 'react';
import styles from './header.module.css';
import clsx from 'clsx';
import { Button, HStack, Text } from '@/shared/ui';
import { LoginByEmail } from '@/features/LoginByEmail';
import { useAuth } from '@/entities/User';
import { useQueryClient } from '@tanstack/react-query';
import { TOKEN_LOCAL_STORAGE_KEY } from '@/shared/constants/localstorage';
import { RegisterByEmail } from '@/features/RegisterByEmail';

export const Header = memo(() => {
    const { data: user } = useAuth();
    const isAuth = Boolean(user);
    const queryClient = useQueryClient();

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
        queryClient.setQueryData(['user'], null);
    }, []);

    return (
        <header className={clsx('container', styles.header)}>
            {/* TODO: Сделать это не тестом а кнопкой и переводить на главную если пользователь не авторизован и переводить на задачи если пользователь авторизован */}
            <Text variant="accent" size="3xl" text="FLOWDAY" />
            {isAuth ? (
                <HStack gap="4" align="center">
                    {/* TODO: добавить кнопку "Мои задачи", которая будет вести в основное приложение, которая будет показываться только на / (главной) */}
                    {/* TODO: Имя пользователя будет кликабельным и вызывать выпадающий список с меню, которое будет иметь пункты "Настройки" и "Выйти" */}
                    <Text text={user?.data.name} />
                    <Button onClick={logout} size="sm" radius="xl" variant="filled">
                        Выйти
                    </Button>
                </HStack>
            ) : (
                <HStack gap="4">
                    <LoginByEmail />
                    <RegisterByEmail />
                </HStack>
            )}
        </header>
    );
});
