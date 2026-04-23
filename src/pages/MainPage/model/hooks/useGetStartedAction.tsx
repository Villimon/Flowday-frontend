import { useAuth } from '@/entities/User';
import { LoginForm } from '@/features/LoginByEmail';
import { getRouteTodos } from '@/shared/constants/router';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';
import { Button, Modal } from '@/shared/ui';
import { ButtonColor } from '@/shared/ui/Buttons/Buttons';
import { useIsMutating } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowRightIcon from '@/shared/assets/arrow-right.svg';

interface useGetStartedActionParams {
    buttonColor?: ButtonColor;
}

export const useGetStartedAction = ({ buttonColor }: useGetStartedActionParams) => {
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
        <>
            <Button
                as={isAuth ? Link : 'button'}
                to={isAuth ? getRouteTodos() : undefined}
                fullWidth={isTablet ? true : false}
                onClick={handleGetStarted}
                variant={'filled'}
                color={buttonColor}
                size="lg"
                radius="xl"
                icon={ArrowRightIcon}
                iconPosition="right"
                iconHeight={20}
                iconWidth={20}
            >
                Начать бесплатно
            </Button>
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
        </>
    );
};
