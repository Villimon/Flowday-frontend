import { memo } from 'react';
import styles from './todos-page.module.css';
import { CreateTodo } from '@/features/CreateTodo';

const TodosPage = memo(() => {
    return (
        <main className={styles.main}>
            <CreateTodo />
            <div>
                <div>Все</div>
                <div>Активные</div>
                <div>Выполненные</div>
            </div>
            <div>
                <div>
                    <span>SVG</span>
                    <p>Название задачи</p>
                    <p>Описание задачи</p>
                </div>
            </div>
        </main>
    );
});

export default TodosPage;
