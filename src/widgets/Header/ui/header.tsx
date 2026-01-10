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
            <Text variant="accent" size="3xl" text="FLOWDAY" />
            {isAuth ? (
                <HStack gap="4" align="center">
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
