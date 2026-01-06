import { memo } from 'react';

export const MainPage = memo(() => {
    const auth = false;
    return (
        <main>
            <p>Информация о сайте</p>
            {auth ? (
                <button>Перейти к работе с задачи</button>
            ) : (
                <button>Войти, чтобы начать работу</button>
            )}
        </main>
    );
});
