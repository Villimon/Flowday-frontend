import { Button, Modal } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { RegisterForm } from './register-form';

export const RegisterByEmail = () => {
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
                Зарегистроваться
            </Button>
            <Modal isOpen={isOpen} onClose={handleCloseModal} title="Зарегистроваться">
                <RegisterForm onClose={handleCloseModal} />
            </Modal>
        </>
    );
};
