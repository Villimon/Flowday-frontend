import { Loader } from '@/shared/ui/Loader/Loader';
import { Card, HStack, Text, VStack } from '@/shared/ui';
import { TodoCard } from '../../../entities/Todos/ui/TodoCard/todo-card';
import { Todo } from '../../../entities/Todos/model/types/types';
import { FC, memo, useCallback } from 'react';
import { EditTodo } from '@/features/EditTodo';
import { DeleteTodo } from '@/features/DeleteTodo';
import { useToggleTodo } from '@/features/ToggleTodo';
import { toast } from 'react-toastify';

interface TodoListProps {
    todos?: Todo[];
    isLoading: boolean;
    isError: boolean;
    status: string;
}

export const TodoList: FC<TodoListProps> = memo(({ isError, isLoading, todos, status }) => {
    const { mutate: toggleTodoMutate } = useToggleTodo();

    const handleToggleTodo = useCallback(
        (todo: Todo) => {
            toggleTodoMutate(todo, {
                onError: error => {
                    toast.error(error.message || 'Ошибка при изменении статуса');
                },
            });
        },
        [toggleTodoMutate]
    );

    const renderActions = useCallback((todo: Todo, className: string) => {
        return (
            <Card className={className} radius="xl">
                <HStack justify="center" align="center" onClick={e => e.stopPropagation()} gap="2">
                    <EditTodo todo={todo} />
                    <DeleteTodo todoId={todo.id} />
                </HStack>
            </Card>
        );
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <Text text="Не удалось получить список задач " />;
    }

    if (!todos?.length) {
        return (
            <HStack justify="center">
                <Text title="Список задач пустой" size="2xl" />
            </HStack>
        );
    }

    const isAllTab = status === 'all';

    return (
        <VStack gap="4" fullWidth>
            {todos?.map(todo => (
                <TodoCard
                    key={todo.id}
                    todo={todo}
                    isCompleted={isAllTab && todo.completed}
                    renderActions={renderActions}
                    onToggle={handleToggleTodo}
                />
            ))}
        </VStack>
    );
});

TodoList.displayName = 'TodoList';
