import { memo } from 'react';
import styles from './main-page.module.css';
import { LandingInfo } from './LandingInfo/landing-info';
import { FeaturesSection } from './FeaturesSection/features-section';

export const MainPage = memo(() => {
    return (
        <main className={styles.main}>
            <LandingInfo />
            <FeaturesSection />
        </main>
    );
});

MainPage.displayName = 'MainPage';
