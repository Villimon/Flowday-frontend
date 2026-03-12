import { Icon } from '@/shared/ui/Icon/Icon';
import EditIcon from '@/shared/assets/edit-pen.svg';
import { FC, useCallback, useState } from 'react';
import { Todo } from '@/entities/Todos';
import { TodoFormData } from '@/features/ManageTodo/model/schema/schema';
import { toast } from 'react-toastify';
import { Modal } from '@/shared/ui';
import { TodoForm } from '@/features/ManageTodo';
import { useEditTodo } from '@/features/EditTodo/api/edit-todo';

interface EditTodoProps {
    todo: Todo;
}

export const EditTodo: FC<EditTodoProps> = ({ todo }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const {
        mutateAsync: editTodoMutate,
        error: mutationError,
        isPending,
        reset: resetMutation,
    } = useEditTodo();

    const handleCreateTodo = useCallback(
        async (value: TodoFormData) => {
            resetMutation();
            try {
                await editTodoMutate({ todo: value, todoId: todo.id });
                toast.success(`Задача обновлена`);
                handleCloseModal();
            } catch (error: any) {
                toast.error(error.message || 'Ошибка при обновление');
            }
        },
        [editTodoMutate, resetMutation]
    );

    return (
        <div>
            <Icon
                clickable
                onClick={handleOpenModal}
                aria-label="Редактирование задачи"
                Svg={EditIcon}
                color="secondary"
            />
            {isOpen && (
                <Modal isOpen={isOpen} onClose={handleCloseModal} title="Редактирование задачи">
                    <TodoForm
                        error={mutationError}
                        isLoading={isPending}
                        onCancel={handleCloseModal}
                        onSubmit={handleCreateTodo}
                        submitText={'Сохранить'}
                        initialData={todo}
                    />
                </Modal>
            )}
        </div>
    );
};
