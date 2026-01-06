import { memo } from 'react';
import styles from './header.module.css';
import clsx from 'clsx';

export const Header = memo(() => {
    const auth = false;
    return (
        <header className={clsx('container', styles.header)}>
            <h1>FLOWDAY</h1>
            {auth ? (
                <div>
                    <span>User Name</span>
                    <button>Выйти</button>
                </div>
            ) : (
                <div>
                    <button>Войти</button>
                    <button>Зарегистрироваться</button>
                </div>
            )}
        </header>
    );
});
