import { FC, useCallback } from 'react';
import { Button, Text, VStack } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { getRouteMain } from '@/shared/constants/router';
import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps {
    title: string;
    description?: string;
    buttonName?: string;
    isFromErrorBoundary?: boolean;
}

export const ErrorFallback: FC<ErrorFallbackProps> = ({
    title,
    description,
    buttonName = 'Вернуться на главную',
    isFromErrorBoundary = false,
}) => {
    const navigate = useNavigate();

    const handleRedirect = useCallback(() => {
        if (isFromErrorBoundary) {
            window.location.href = getRouteMain();
            return;
        }
        navigate(getRouteMain());
    }, [navigate, isFromErrorBoundary]);

    return (
        <VStack className={styles.container} align="center" justify="center" gap="8">
            <VStack gap="8" align="center">
                <VStack fullWidth gap="2" align="center">
                    <Text title={title} size="3xl" />
                    {description && <Text align="center" text={description} />}
                </VStack>
                <Button onClick={handleRedirect} size="md">
                    {buttonName}
                </Button>
            </VStack>
        </VStack>
    );
};
