import clsx from 'clsx';
import { FC, memo, ReactElement } from 'react';
import styles from './main-layout.module.css';

interface MainLayoutProps {
    className?: string;
    header: ReactElement;
    content: ReactElement;
    footer?: ReactElement;
}

export const MainLayout: FC<MainLayoutProps> = memo(({ content, header, footer, className }) => {
    return (
        <div className={clsx(styles.mainLayout, [className])}>
            <div className={styles.header}>{header}</div>
            <div className={styles.content}>{content}</div>
            {footer && <div className={styles.footer}>{footer}</div>}
        </div>
    );
});

MainLayout.displayName = 'MainLayout';
