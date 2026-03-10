import { memo } from 'react';
import styles from './todos-page.module.css';
import { CreateTodo } from '@/features/CreateTodo';
import { TodoList } from '@/entities/Todos';
import { VStack } from '@/shared/ui';

const TodosPage = memo(() => {
    return (
        <main className={styles.main}>
            <VStack gap="8" className={styles.wrapper}>
                <CreateTodo />
                <div>
                    <div>Все</div>
                    <div>Активные</div>
                    <div>Выполненные</div>
                </div>
                {/* TODO вынесети в виджет */}
                <TodoList />
            </VStack>
        </main>
    );
});

export default TodosPage;
