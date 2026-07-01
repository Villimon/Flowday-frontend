import { memo, useCallback, useMemo, useState } from 'react';
import styles from './todos-page.module.css';
import { CreateTodo } from '@/features/CreateTodo';
import { HStack, VStack } from '@/shared/ui';
import { FilterTodos } from '@/features/FilterTodos';
import { useTodos } from '@/entities/Todos/api/use-todo';
import { TabItem } from '@/shared/ui/Tabs/Tabs';
import clsx from 'clsx';
import { TodoList } from '@/widgets/TodoListView';
import { TodoStatus } from '@/entities/Todos';
import { FilterTodosView } from '@/features/FilterTodosView';
import { TodoView } from '@/entities/Todos/model/types/types';

// TODO: Если захочу чтобы состояние сохранялось перейти на Стейт в URL-квери параметрах (?view=week&status=active), а внутри фич брать все из роута (url)
// Либо сделать контекст для страницы
const TodosPage = memo(() => {
    const [status, setStatus] = useState<TodoStatus>('all');
    const [view, setView] = useState<TodoView>('day');
    const [currentDate] = useState(new Date());

    const handleStatusChange = useCallback((newStatus: TabItem) => {
        setStatus(newStatus.value as TodoStatus);
    }, []);

    const handleViewChange = useCallback((newView: TabItem) => {
        setView(newView.value as TodoView);
    }, []);

    const { data, isLoading, isError } = useTodos({ status, view, currentDate });
    // TODO: убрать когда добавлю каунтер на бэк
    const { data: allTodosData } = useTodos({ status: 'all', view });

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
                        <HStack fullWidth wrap="wrap" gap="4" align="center" justify="between">
                            <FilterTodosView currentView={view} onViewChange={handleViewChange} />
                        </HStack>
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
                            view={view}
                        />
                    </div>
                </div>
            </VStack>
        </main>
    );
});

export default TodosPage;

TodosPage.displayName = 'TodosPage';
