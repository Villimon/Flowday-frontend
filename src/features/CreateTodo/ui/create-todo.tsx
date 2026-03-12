import { TodoForm } from '@/features/ManageTodo';
import { Button, Modal } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateTodo } from '@/features/CreateTodo/api/create-todo';
import { TodoFormData } from '@/features/ManageTodo/model/schema/schema';

export const CreateTodo = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const {
        mutateAsync: createTodoMutate,
        error: mutationError,
        isPending,
        reset: resetMutation,
    } = useCreateTodo();

    const handleCreateTodo = useCallback(
        async (value: TodoFormData) => {
            resetMutation();
            try {
                await createTodoMutate(value);
                toast.success(`Задача создана`);
                handleCloseModal();
            } catch (error: any) {
                toast.error(error.message || 'Ошибка при создание');
            }
        },
        [createTodoMutate, resetMutation, handleCloseModal]
    );

    return (
        <div>
            <Button onClick={handleOpenModal} variant="filled">
                Создать задачу
            </Button>
            {isOpen && (
                <Modal isOpen={isOpen} onClose={handleCloseModal} title="Создать задачу">
                    <TodoForm
                        error={mutationError}
                        isLoading={isPending}
                        onCancel={handleCloseModal}
                        onSubmit={handleCreateTodo}
                        submitText={'Создать'}
                    />
                </Modal>
            )}
        </div>
    );
};
