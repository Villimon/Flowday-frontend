import { memo } from 'react';

const ErrorPage = memo(() => {
    return (
        <main>
            Упс, такой страницы нет
            <button>Вернуться на главную</button>
        </main>
    );
});

export default ErrorPage;
