import { Icon } from '@/shared/ui/Icon/Icon';
import EditIcon from '@/shared/assets/edit-pen.svg';
import { FC, useCallback, useState } from 'react';
import { Todo } from '@/entities/Todos';
import { TodoFormData } from '@/features/ManageTodo/model/schema/schema';
import { toast } from 'react-toastify';
import { Modal } from '@/shared/ui';
import { TodoForm } from '@/features/ManageTodo';
import { useEditTodo } from '@/features/EditTodo/api/edit-todo';
import { ApiError } from '@/shared/types/api.types';
import styles from './edit-todo.module.css';

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
            } catch (e) {
                const error = e as ApiError;
                const errorMessage = 'errors' in error ? error.errors[0]?.msg : error.message;
                toast.error(errorMessage || 'Ошибка при обновление');
            }
        },
        [editTodoMutate, resetMutation, todo.id, handleCloseModal]
    );

    return (
        <>
            <div className={styles.icon}>
                <Icon
                    clickable
                    onClick={handleOpenModal}
                    aria-label="Редактирование задачи"
                    Svg={EditIcon}
                    color="primary"
                    width={22}
                    height={22}
                />
            </div>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    disableClose={isPending}
                    title="Редактирование задачи"
                >
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
        </>
    );
};
