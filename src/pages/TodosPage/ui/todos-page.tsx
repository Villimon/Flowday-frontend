import { memo } from 'react';

const TodosPage = memo(() => {
    return (
        <main>
            <div>
                <button>Создать задачу</button>
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
