import { memo, useCallback, useState } from 'react';
import styles from './todos-page.module.css';
import { CreateTodo } from '@/features/CreateTodo';
import { TodoList } from '@/entities/Todos';
import { VStack } from '@/shared/ui';
import { FilterTodos } from '@/features/FilterTodos';
import { TodoFilter } from '@/features/FilterTodos/model/types/types';
import { useTodos } from '@/entities/Todos/api/use-todo';
import { TabItem } from '@/shared/ui/Tabs/Tabs';

const TodosPage = memo(() => {
    const [filter, setFilter] = useState<TodoFilter>('all');

    const handleFilterChange = useCallback((newFilter: TabItem) => {
        setFilter(newFilter.value as TodoFilter);
    }, []);

    const { data, isFetching, isError } = useTodos({ filter });

    return (
        <main className={styles.main}>
            <VStack gap="8" className={styles.wrapper}>
                <CreateTodo />
                <FilterTodos currentFilter={filter} onFilterChange={handleFilterChange} />
                <TodoList
                    todos={data?.data}
                    isLoading={isFetching}
                    isError={isError}
                    filter={filter}
                />
            </VStack>
        </main>
    );
});

export default TodosPage;
