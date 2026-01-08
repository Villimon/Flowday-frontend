import { memo } from 'react';
import styles from './header.module.css';
import clsx from 'clsx';
import { Button, HStack, Text } from '@/shared/ui';

export const Header = memo(() => {
    const auth = false;
    return (
        <header className={clsx('container', styles.header)}>
            <Text variant="accent" size="3xl" text="FLOWDAY" />
            {auth ? (
                <HStack gap="4" align="center">
                    <Text text="UserName" />
                    <Button size="sm" radius="xl" variant="filled">
                        Выйти
                    </Button>
                </HStack>
            ) : (
                <HStack gap="4">
                    <Button size="sm" radius="xl" variant="filled">
                        Войти
                    </Button>
                    <Button size="sm" radius="xl" variant="filled">
                        Регистрация
                    </Button>
                </HStack>
            )}
        </header>
    );
});
