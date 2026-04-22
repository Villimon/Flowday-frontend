import { memo } from 'react';
import styles from './main-page.module.css';
import { LandingInfo } from '@/widgets/LandingInfo';

export const MainPage = memo(() => {
    return (
        <main className={styles.main}>
            <LandingInfo />
        </main>
    );
});

MainPage.displayName = 'MainPage';
