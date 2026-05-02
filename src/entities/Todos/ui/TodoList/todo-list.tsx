import { Loader } from '@/shared/ui/Loader/Loader';
import { HStack, Text, VStack } from '@/shared/ui';
import { TodoCard } from '../TodoCard/todo-card';
import { Todo } from '../../model/types/types';
import { FC } from 'react';

interface TodoListProps {
    todos?: Todo[];
    isLoading: boolean;
    isError: boolean;
    status: string;
}

export const TodoList: FC<TodoListProps> = ({ isError, isLoading, todos, status }) => {
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

    return (
        <VStack gap="4" fullWidth>
            {todos?.map(todo => (
                <TodoCard key={todo.id} todo={todo} status={status} />
            ))}
        </VStack>
    );
};
