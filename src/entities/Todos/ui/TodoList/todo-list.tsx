import { Loader } from '@/shared/ui/Loader/Loader';
import { Text, VStack } from '@/shared/ui';
import { TodoCard } from '../TodoCard/todo-card';
import styles from './todo-list.module.css';
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
        return <Text title="Список задач пустой" align="center" size="2xl" />;
    }

    return (
        <VStack gap="4" fullWidth className={styles.container}>
            {todos?.map(todo => (
                <TodoCard key={todo.id} todo={todo} status={status} />
            ))}
        </VStack>
    );
};
