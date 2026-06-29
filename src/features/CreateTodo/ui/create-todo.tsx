import { TodoForm } from '@/features/ManageTodo';
import { Button, Modal } from '@/shared/ui';
import { memo, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateTodo } from '@/features/CreateTodo/api/create-todo';
import { TodoFormData } from '@/features/ManageTodo/model/schema/schema';
import PlusIcon from '@/shared/assets/plus.svg';
import { formatToBackendISO } from '@/shared/lib/formatToISO';

export const CreateTodo = memo(() => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const {
        mutate: createTodoMutate,
        error: mutationError,
        isPending,
        reset: resetMutation,
    } = useCreateTodo();

    const handleCreateTodo = useCallback(
        async (value: TodoFormData) => {
            resetMutation();

            const backendData = {
                ...value,
                startDate: formatToBackendISO(value.startDate),
                endDate: formatToBackendISO(value.endDate),
            };

            createTodoMutate(backendData, {
                onSuccess: () => {
                    toast.success('Задача создана');
                    handleCloseModal();
                },
                onError: error => {
                    toast.error(error.message || 'Ошибка при создании');
                },
            });
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
                data-testid="create-todo-button"
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
});

CreateTodo.displayName = 'CreateTodo';
