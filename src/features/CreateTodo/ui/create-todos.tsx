import { CreateTodoForm } from './create-todo-form';
import { Button, Modal } from '@/shared/ui';
import { useCallback, useState } from 'react';

export const CreateTodo = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <div>
            <Button onClick={handleOpenModal} variant="filled">
                Создать задачу
            </Button>
            <Modal isOpen={isOpen} onClose={handleCloseModal} title="Создать задачу">
                <CreateTodoForm onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};
