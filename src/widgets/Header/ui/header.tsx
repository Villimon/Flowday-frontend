import { memo } from 'react';
import styles from './header.module.css';
import clsx from 'clsx';

export const Header = memo(() => {
    return (
        <header className={clsx('container', styles.header)}>
            <h1>FLOWDAY</h1>
            <div>
                <button>Войти</button>
                <button>Зарегистрироваться</button>
            </div>
        </header>
    );
});
