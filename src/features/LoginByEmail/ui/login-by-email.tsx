import { Button, Modal } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { LoginForm } from './login-form';

export const LoginByEmail = () => {
    const [isOpen, setIsOpen] = useState(false);

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
            <Modal isOpen={isOpen} onClose={handleCloseModal} title="Войти">
                <LoginForm onClose={handleCloseModal} />
            </Modal>
        </>
    );
};
