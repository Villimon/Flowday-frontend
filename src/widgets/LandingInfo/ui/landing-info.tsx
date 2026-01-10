import { memo, useCallback } from 'react';
import styles from './landing-info.module.css';
import { Button, HStack, Text, VStack } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { getRouteTodos } from '@/shared/constants/router';

export const LandingInfo = memo(() => {
    const navigate = useNavigate();
    const handleRedirect = useCallback(() => {
        // TODO: Если мы не авторизированы то переходит на /login (новая страница), иначе логика по переходу на страницу задач
        navigate(getRouteTodos());
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
                <HStack gap="4">
                    <Button onClick={handleRedirect}>Начать бесплатно</Button>
                    <Button variant="filled">Как это работает</Button>
                </HStack>
            </VStack>
        </section>
    );
});
