import { memo, useCallback, useMemo } from 'react';
import styles from './header.module.css';
import clsx from 'clsx';
import { Button, Card, HStack, Text, VStack } from '@/shared/ui';
import { LoginByEmail } from '@/features/LoginByEmail';
import { useAuth } from '@/entities/User';
import { useQueryClient } from '@tanstack/react-query';
import { TOKEN_LOCAL_STORAGE_KEY } from '@/shared/constants/localstorage';
import { RegisterByEmail } from '@/features/RegisterByEmail';
import { Link } from 'react-router-dom';
import { getRouteMain, getRouteTodos } from '@/shared/constants/router';
import CalendarIcon from '@/shared/assets/calendar.svg';
import DashboardIcon from '@/shared/assets/dashboard.svg';
import { Menu, MenuItem } from '@/shared/ui/Menu/Menu';
import ProfileIcon from '@/shared/assets/profile.svg';
import LogoutIcon from '@/shared/assets/logout.svg';

export const Header = memo(() => {
    const { data: user, isAuth } = useAuth();
    const queryClient = useQueryClient();

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
        queryClient.setQueryData(['user'], null);
        queryClient.removeQueries();
        queryClient.clear();
    }, [queryClient]);

    const menuItems = useMemo(
        () =>
            [
                {
                    content: 'Профиль',
                    onClick: () => {},
                    Icon: ProfileIcon,
                },
                {
                    content: 'Выйти',
                    onClick: logout,
                    Icon: LogoutIcon,
                    color: 'error',
                },
            ] as MenuItem[],
        [logout]
    );

    return (
        <header className={clsx('container', styles.header)}>
            <Button
                as={Link}
                to={getRouteMain()}
                icon={CalendarIcon}
                size="xl"
                variant="clear"
                color="primary"
                iconColor="secondary"
                iconWidth={26}
                iconHeight={26}
                iconWrapperStyle={styles.iconWrapper}
                ariaLabelIcon="На главную"
            >
                FLOWDAY
            </Button>

            {isAuth ? (
                <HStack gap="8" align="center">
                    <nav>
                        <Button
                            as={Link}
                            to={getRouteTodos()}
                            icon={DashboardIcon}
                            variant="clear"
                            color="primary"
                            iconColor="secondary"
                            iconWidth={26}
                            iconHeight={26}
                            ariaLabelIcon="К задачам"
                        >
                            Планировщик
                        </Button>
                    </nav>
                    <Menu
                        className={styles.menu}
                        direction="bottom-right"
                        items={menuItems}
                        trigger={
                            <Card horizontalPadding="12" verticalPadding="6" radius="full">
                                <HStack gap="4" justify="center" align="center">
                                    <Text
                                        className={styles.avatar}
                                        text={user?.data.name[0].toUpperCase()}
                                    />
                                    <Text text={user?.data.name} size="lg" />
                                </HStack>
                            </Card>
                        }
                        headerContent={
                            <VStack>
                                <Text text={user?.data.name} size="sm" weight="semibold" />
                                <Text text={user?.data.email} size="xs" variant="secondary" />
                            </VStack>
                        }
                    />
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
