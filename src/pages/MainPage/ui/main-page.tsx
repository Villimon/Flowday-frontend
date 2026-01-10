import { useAuth } from '@/entities/User';
import { memo } from 'react';
import styles from './main-page.module.css';
import { LandingInfo } from '@/widgets/LandingInfo';

export const MainPage = memo(() => {
    const { data: user } = useAuth();
    const isAuth = Boolean(user);
    return (
        <main className={styles.main}>
            <LandingInfo />
        </main>
    );
});
