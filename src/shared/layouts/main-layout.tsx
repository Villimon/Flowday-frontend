import clsx from 'clsx';
import { FC, memo, ReactElement } from 'react';
import styles from './main-layout.module.css';

interface MainLayoutProps {
    className?: string;
    header: ReactElement;
    content: ReactElement;
}

export const MainLayout: FC<MainLayoutProps> = memo(
    ({ content, header, className }) => {
        return (
            <div className={clsx(styles.mainLayout, [className])}>
                <div className={styles.header}>{header}</div>
                <div className={styles.content}>{content}</div>
            </div>
        );
    }
);
