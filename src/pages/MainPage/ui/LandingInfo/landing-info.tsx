import { memo, useCallback, useState } from 'react';
import styles from './landing-info.module.css';
import { Button, HStack, Modal, Text, VStack } from '@/shared/ui';
import { Link } from 'react-router-dom';
import { getRouteTodos } from '@/shared/constants/router';
import { LoginForm } from '@/features/LoginByEmail';
import { useAuth } from '@/entities/User';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';
import { useIsMutating } from '@tanstack/react-query';
import clsx from 'clsx';

export const LandingInfo = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuth } = useAuth();
    const isTablet = useMedia('(max-width: 768px)');
    const isLoggingIn = useIsMutating({ mutationKey: ['login-action'] }) > 0;

    const handleGetStarted = useCallback(() => {
        if (isAuth) return;
        setIsOpen(true);
    }, [isAuth]);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <section className={clsx(styles.info, 'container')}>
            <VStack gap="16" align="center">
                <VStack>
                    <Text size="7xl" align="center" variant="accent" title="Планируй день." />
                    <Text
                        size="7xl"
                        align="center"
                        title="Покоряй неделю."
                        as={'span'}
                        className={styles.title}
                        headerTag="h2"
                    />
                </VStack>
                <VStack className={styles.description}>
                    <Text
                        variant="secondary"
                        align="center"
                        size="3xl"
                        text="Красивый планировщик, календарь и менеджер задач. Организуйте свою жизнь с удобными видами «День», «Неделя», «Месяц» и списком."
                    />
                </VStack>
                <HStack gap={isTablet ? '16' : '8'} wrap={isTablet ? 'wrap' : 'nowrap'}>
                    <Button
                        as={isAuth ? Link : 'button'}
                        to={isAuth ? getRouteTodos() : undefined}
                        fullWidth={isTablet ? true : false}
                        onClick={handleGetStarted}
                        variant="filled"
                        size="lg"
                        radius="xl"
                    >
                        Начать бесплатно
                    </Button>
                    <Button
                        as={Link}
                        to={'#features'}
                        fullWidth={isTablet ? true : false}
                        size="lg"
                        radius="xl"
                    >
                        Узнать больше
                    </Button>
                </HStack>
                {isOpen && (
                    <Modal
                        disableClose={isLoggingIn}
                        isOpen={isOpen}
                        onClose={handleCloseModal}
                        title="Войти"
                    >
                        <LoginForm onClose={handleCloseModal} isRedirect />
                    </Modal>
                )}
            </VStack>
        </section>
    );
});

LandingInfo.displayName = 'LandingInfo';
