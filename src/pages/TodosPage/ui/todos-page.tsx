import { memo, useCallback, useMemo, useState } from 'react';
import styles from './todos-page.module.css';
import { CreateTodo } from '@/features/CreateTodo';
import { TodoList } from '@/entities/Todos';
import { HStack, VStack } from '@/shared/ui';
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
    const { data: allTodosData } = useTodos({ status: 'all' });

    const todoStats = useMemo(() => {
        const all = allTodosData?.data || [];
        return {
            all: all.length,
            active: all.filter(t => !t.completed).length,
            completed: all.filter(t => t.completed).length,
        };
    }, [allTodosData]);

    return (
        <main className={clsx(styles.main)}>
            <VStack gap="8" fullWidth className={styles.wrapper}>
                <div className={styles.filterSection}>
                    <VStack className={'container'} gap="8" fullWidth>
                        {/* <HStack fullWidth wrap="wrap" gap="4" align="center" justify="between">
                            <FilterTodos
                                currentStatus={status}
                                onStatusChange={handleStatusChange}
                            />
                            <CreateTodo />
                        </HStack> */}
                        <HStack fullWidth wrap="wrap" gap="4" align="center" justify="end">
                            <FilterTodos
                                counts={todoStats}
                                currentStatus={status}
                                onStatusChange={handleStatusChange}
                            />
                            <CreateTodo />
                        </HStack>
                    </VStack>
                </div>

                <div className={clsx(styles.todoSection)}>
                    <div className={clsx('container', styles.scrollableList)}>
                        <TodoList
                            todos={data?.data}
                            isLoading={isLoading}
                            isError={isError}
                            status={status}
                        />
                    </div>
                </div>
            </VStack>
        </main>
    );
});

export default TodosPage;

TodosPage.displayName = 'TodosPage';
