import clsx from 'clsx';
import { FC, memo, ReactElement } from 'react';
import styles from './main-layout.module.css';
import { ErrorBoundary } from '@/app/providers/ErrorBoundary';

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
            <ErrorBoundary>
                <div className={styles.content}>{content}</div>
            </ErrorBoundary>
            {footer && <div className={styles.footer}>{footer}</div>}
        </div>
    );
});

MainLayout.displayName = 'MainLayout';
