import { Button, Modal } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { LoginForm } from './login-form';
import { useIsMutating } from '@tanstack/react-query';

export const LoginByEmail = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isLoggingIn = useIsMutating({ mutationKey: ['login-action'] }) > 0;

    const handleOpenModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <>
            <Button onClick={handleOpenModal} size="sm" radius="xl" variant="filled">
                Войти
            </Button>
            {isOpen && (
                <Modal
                    disableClose={isLoggingIn}
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    title="Войти"
                >
                    <LoginForm onClose={handleCloseModal} />
                </Modal>
            )}
        </>
    );
};
