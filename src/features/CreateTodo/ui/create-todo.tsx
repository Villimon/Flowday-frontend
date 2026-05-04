import { TodoForm } from '@/features/ManageTodo';
import { Button, Modal } from '@/shared/ui';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateTodo } from '@/features/CreateTodo/api/create-todo';
import { TodoFormData } from '@/features/ManageTodo/model/schema/schema';
import { ApiError } from '@/shared/types/api.types';
import PlusIcon from '@/shared/assets/plus.svg';

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
            } catch (e) {
                const error = e as ApiError;
                const errorMessage = 'errors' in error ? error.errors[0]?.msg : error.message;
                toast.error(errorMessage || 'Ошибка при создании');
            }
        },
        [createTodoMutate, resetMutation, handleCloseModal]
    );

    return (
        <div>
            <Button
                icon={PlusIcon}
                radius="xl"
                size="sm"
                onClick={handleOpenModal}
                variant="filled"
            >
                Новая задача
            </Button>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    disableClose={isPending}
                    title="Новая задача"
                    size="md"
                >
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
