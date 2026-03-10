import { Loader } from '@/shared/ui/Loader/Loader';
import { useTodos } from '../../api/use-todo';
import { Text, VStack } from '@/shared/ui';
import { TodoCard } from '../TodoCard/todo-card';
import styles from './todo-list.module.css';

export const TodoList = () => {
    const { data, isFetching, isError } = useTodos();

    if (isFetching) {
        // TODO add sceleton
        return <Loader />;
    }

    if (isError) {
        return <Text text="Не удалось получить список задач " />;
    }

    if (!data?.data.length) {
        return <Text title="Список задач пустой" align="center" size="2xl" />;
    }

    return (
        <VStack gap="4" fullWidth className={styles.container}>
            {data?.data.map(todo => (
                <TodoCard key={todo.id} todo={todo} />
            ))}
        </VStack>
    );
};
