import { Icon } from '@/shared/ui/Icon/Icon';
import EditIcon from '@/shared/assets/edit-pen.svg';
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { Todo } from '@/entities/Todos';
import { TodoFormData } from '@/features/ManageTodo/model/schema/schema';
import { toast } from 'react-toastify';
import { Modal } from '@/shared/ui';
import { TodoForm } from '@/features/ManageTodo';
import { useEditTodo } from '@/features/EditTodo/api/edit-todo';
import styles from './edit-todo.module.css';
import { formatToBackendISO } from '@/shared/lib/formatToISO';
import { formatToDisplay } from '@/shared/lib/formatToDisplay';

interface EditTodoProps {
    todo: Todo;
}

export const EditTodo: FC<EditTodoProps> = memo(({ todo }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const {
        mutate: editTodoMutate,
        error: mutationError,
        isPending,
        reset: resetMutation,
    } = useEditTodo();

    const handleEditTodo = useCallback(
        async (value: TodoFormData) => {
            resetMutation();

            const backendData = {
                ...value,
                startDate: formatToBackendISO(value.startDate),
                endDate: formatToBackendISO(value.endDate),
            };

            editTodoMutate(
                { todo: backendData, todoId: todo.id },
                {
                    onSuccess: () => {
                        toast.success(`Задача обновлена`);
                        handleCloseModal();
                    },
                    onError: error => {
                        toast.error(error.message || 'Ошибка при обновление');
                    },
                }
            );
        },
        [editTodoMutate, resetMutation, todo.id, handleCloseModal]
    );

    const initialFormData: TodoFormData | null = useMemo(() => {
        if (!isOpen) return null;

        return {
            title: todo.title,
            description: todo.description,
            labels: todo.labels?.map(label => label.id) || [],
            startDate: formatToDisplay(todo.startDate ?? ''),
            endDate: formatToDisplay(todo.endDate ?? ''),
        };
    }, [isOpen, todo.description, todo.labels, todo.title, todo.startDate, todo.endDate]);

    return (
        <>
            <div data-testid="edit-todo-button" className={styles.icon}>
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
            {isOpen && initialFormData && (
                <Modal
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    disableClose={isPending}
                    title="Редактирование задачи"
                    size="md"
                >
                    <TodoForm
                        error={mutationError}
                        isLoading={isPending}
                        onCancel={handleCloseModal}
                        onSubmit={handleEditTodo}
                        submitText={'Сохранить'}
                        initialData={initialFormData}
                    />
                </Modal>
            )}
        </>
    );
});

EditTodo.displayName = 'EditTodo';
