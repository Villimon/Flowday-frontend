import { TodoStatus, TodoView } from '@/entities/Todos';
import { useRemoveCompletedTodos } from '@/features/RemoveCompletedTodos/api/remove-completed-todos';
import { Button } from '@/shared/ui';
import { FC, memo, useCallback } from 'react';
import { toast } from 'react-toastify';

interface RemoveCompletedTodosProps {
    status: TodoStatus;
    view: TodoView;
    date: Date;
    title: string;
}

// day = Очистить выполненные за день
// list = Очистить все выполненные

export const RemoveCompletedTodos: FC<RemoveCompletedTodosProps> = memo(
    ({ title, date, status, view }) => {
        const { mutate: removeCompletedTodos } = useRemoveCompletedTodos({
            view,
            date,
            status,
        });

        const handleRemoveCompletedTodos = useCallback(() => {
            removeCompletedTodos(undefined, {
                onError: error => {
                    toast.error(error.message || 'Ошибка при удалении выполненных задач');
                },
            });
        }, [removeCompletedTodos]);

        return (
            <Button radius="xl" size="sm" color="error" onClick={handleRemoveCompletedTodos}>
                {title}
            </Button>
        );
    }
);

RemoveCompletedTodos.displayName = 'RemoveCompletedTodos';
