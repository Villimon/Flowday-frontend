import { Loader } from '@/shared/ui/Loader/Loader';
import { HStack, Text, VStack } from '@/shared/ui';
import { TodoCard } from '../TodoCard/todo-card';
import { Todo } from '../../model/types/types';
import { FC, memo } from 'react';

interface TodoListProps {
    todos?: Todo[];
    isLoading: boolean;
    isError: boolean;
    status: string;
}

// TODO: TodoList сделать виджетом, widgets/TodoList, widgets/TodoCalendar, widgets/TodoBoard - «День», «Неделя», «Месяц» — это будут разные виджеты.
export const TodoList: FC<TodoListProps> = memo(({ isError, isLoading, todos, status }) => {
    if (isLoading) {
        // TODO add sceleton
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

    /* 
    // TODO: пропс под слот 
    actions={
        // Features передаем через слот (FSD-way)
        <HStack gap="2">
            <EditTodo todo={todo} />
            <DeleteTodo todoId={todo.id} />
        </HStack>
    }
    
    */
    return (
        <VStack gap="4" fullWidth>
            {todos?.map(todo => (
                <TodoCard key={todo.id} todo={todo} isCompleted={isAllTab && todo.completed} />
            ))}
        </VStack>
    );
});

TodoList.displayName = 'TodoList';
