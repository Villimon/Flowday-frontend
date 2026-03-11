import { Icon } from '@/shared/ui/Icon/Icon';
import DeleteIcon from '@/shared/assets/trash.svg';
import { useDeleteTodo } from '../api/delete-todo';
import { FC, useCallback } from 'react';

interface DeleteTodoProps {
    todoId: string;
}

export const DeleteTodo: FC<DeleteTodoProps> = ({ todoId }) => {
    const { mutate: deleteTodoMutate, isPending } = useDeleteTodo();

    const handleDeleteTodo = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            deleteTodoMutate(todoId);
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
        />
    );
};
