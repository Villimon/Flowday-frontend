import { memo, useCallback, useState } from 'react';
import styles from './todos-page.module.css';
import { CreateTodo } from '@/features/CreateTodo';
import { TodoList } from '@/entities/Todos';
import { VStack } from '@/shared/ui';
import { FilterTodos } from '@/features/FilterTodos';
import { TodoStatus } from '@/features/FilterTodos/model/types/types';
import { useTodos } from '@/entities/Todos/api/use-todo';
import { TabItem } from '@/shared/ui/Tabs/Tabs';
import clsx from 'clsx';

const TodosPage = memo(() => {
    const [status, setStatus] = useState<TodoStatus>('all');

    const handleStatusChange = useCallback((newStatus: TabItem) => {
        setStatus(newStatus.value as TodoStatus);
    }, []);

    const { data, isLoading, isError } = useTodos({ status });

    return (
        <main className={clsx(styles.main, 'container')}>
            <VStack gap="8" className={styles.wrapper}>
                <CreateTodo />
                <FilterTodos currentStatus={status} onStatusChange={handleStatusChange} />
                <TodoList
                    todos={data?.data}
                    isLoading={isLoading}
                    isError={isError}
                    status={status}
                />
            </VStack>
        </main>
    );
});

export default TodosPage;

TodosPage.displayName = 'TodosPage';
