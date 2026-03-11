import { Icon } from '@/shared/ui/Icon/Icon';
import DeleteIcon from '@/shared/assets/trash.svg';
import { useDeleteTodo } from '../api/delete-todo';
import { FC, useCallback } from 'react';
import styles from './delete-todo.module.css';
import { toast } from 'react-toastify';

interface DeleteTodoProps {
    todoId: string;
}

export const DeleteTodo: FC<DeleteTodoProps> = ({ todoId }) => {
    const { mutateAsync: deleteTodoMutate, isPending } = useDeleteTodo();

    const handleDeleteTodo = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            deleteTodoMutate(todoId, {
                onSuccess: () => {
                    toast.success('Задача удалена');
                },
                onError: error => {
                    toast.error(error.message || 'Ошибка при удалении');
                },
            });
        },
        [deleteTodoMutate, todoId]
    );

    return (
        <Icon
            clickable
            onClick={handleDeleteTodo}
            aria-label="Удалить задачу"
            Svg={DeleteIcon}
            color="warning"
            disabled={isPending}
            className={isPending ? styles.deleting : ''}
        />
    );
};
