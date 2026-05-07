import { Button, Modal } from '@/shared/ui';
import { memo, useCallback, useState } from 'react';
import { RegisterForm } from './register-form';
import { useIsMutating } from '@tanstack/react-query';

export const RegisterByEmail = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const isRegister = useIsMutating({ mutationKey: ['register-action'] }) > 0;

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
            {isOpen && (
                <Modal
                    disableClose={isRegister}
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    title="Зарегистроваться"
                >
                    <RegisterForm onClose={handleCloseModal} />
                </Modal>
            )}
        </>
    );
});

RegisterByEmail.displayName = 'RegisterByEmail';
