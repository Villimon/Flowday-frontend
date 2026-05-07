import { Icon } from '@/shared/ui/Icon/Icon';
import DeleteIcon from '@/shared/assets/trash.svg';
import { useDeleteTodo } from '../api/delete-todo';
import { FC, memo, useCallback } from 'react';
import styles from './delete-todo.module.css';

interface DeleteTodoProps {
    todoId: string;
}

export const DeleteTodo: FC<DeleteTodoProps> = memo(({ todoId }) => {
    const { mutate: deleteTodoMutate, isPending } = useDeleteTodo();

    const handleDeleteTodo = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            deleteTodoMutate(todoId);
        },
        [deleteTodoMutate, todoId]
    );

    return (
        <div data-testid="delete-todo-button" className={styles.icon}>
            <Icon
                clickable
                onClick={handleDeleteTodo}
                aria-label="Удалить задачу"
                Svg={DeleteIcon}
                color="warning"
                disabled={isPending}
                width={22}
                height={22}
            />
        </div>
    );
});

DeleteTodo.displayName = 'DeleteTodo';
