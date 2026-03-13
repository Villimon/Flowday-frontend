import { memo, useCallback, useState } from 'react';
import styles from './landing-info.module.css';
import { Button, HStack, Modal, Text, VStack } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { getRouteTodos } from '@/shared/constants/router';
import { LoginForm } from '@/features/LoginByEmail';
import { useAuth } from '@/entities/User';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';

export const LandingInfo = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuth } = useAuth();
    const isMobile = useMedia('(max-width: 768px)');

    const navigate = useNavigate();

    const handleGetStarted = useCallback(() => {
        if (isAuth) {
            return navigate(getRouteTodos());
        }
        setIsOpen(true);

        // TODO в релизе 1.0.0: Если мы не авторизированы то переходит на /login (новая страница), иначе логика по переходу на страницу задач
    }, [navigate, isAuth]);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <section className={styles.info}>
            <VStack gap="8">
                <Text size="3xl" variant="accent" title="Управляйте днем, а не списком" />
                <VStack>
                    <Text
                        variant="secondary"
                        text="Flowday превращает хаос задач в ясный план дня."
                    />
                    <Text
                        variant="secondary"
                        text="Создавайте, редактируйте и завершайте дела в простом, фокусированном интерфейсе."
                    />
                </VStack>
                <HStack gap="4" wrap={isMobile ? 'wrap' : 'nowrap'}>
                    <Button fullWidth={isMobile ? true : false} onClick={handleGetStarted}>
                        Начать бесплатно
                    </Button>
                    <Button fullWidth={isMobile ? true : false} variant="filled">
                        Как это работает
                    </Button>
                </HStack>
                {isOpen && (
                    <Modal isOpen={isOpen} onClose={handleCloseModal} title="Войти">
                        <LoginForm onClose={handleCloseModal} isRedirect />
                    </Modal>
                )}
            </VStack>
        </section>
    );
});
