import { memo, useCallback } from 'react';
import styles from './header.module.css';
import clsx from 'clsx';
import { Button, HStack, Text } from '@/shared/ui';
import { LoginByEmail } from '@/features/LoginByEmail';
import { useAuth } from '@/entities/User';
import { useQueryClient } from '@tanstack/react-query';
import { TOKEN_LOCAL_STORAGE_KEY } from '@/shared/constants/localstorage';
import { RegisterByEmail } from '@/features/RegisterByEmail';
import { useNavigate } from 'react-router-dom';
import { getRouteMain } from '@/shared/constants/router';

export const Header = memo(() => {
    const { data: user, isAuth } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
        queryClient.setQueryData(['user'], null);
        queryClient.removeQueries();
        queryClient.clear();
    }, [queryClient]);

    const handleRedirect = useCallback(() => {
        navigate(getRouteMain());
    }, [navigate]);

    return (
        <header className={clsx('container', styles.header)}>
            <Button onClick={handleRedirect} size="xl" variant="clear" color="primary">
                FLOWDAY
            </Button>
            {isAuth ? (
                <HStack gap="4" align="center">
                    {/* TODO: добавить кнопку "Мои задачи", которая будет вести в основное приложение, которая будет показываться только на / (главной) */}
                    {/* TODO: Имя пользователя будет кликабельным и вызывать выпадающий список с меню, которое будет иметь пункты "Настройки" и "Выйти" */}
                    <Text text={user?.data.name} size="lg" />
                    <Button onClick={logout} size="md" radius="xl" variant="filled">
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

Header.displayName = 'Header';
