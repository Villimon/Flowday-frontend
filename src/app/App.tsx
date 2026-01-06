import { MainLayout } from '@/shared/layouts/main-layout';
import { AppRouter } from './providers/router';
import './styles/index.css';
import { Header } from '@/widgets/Header';

// GLOBAL TODO:
// Настроить мета данные для SEO
// Наставивать ацесабилити для компонентов и соблюдать симантику

export const App = () => {
    return (
        <div className="app">
            <MainLayout content={<AppRouter />} header={<Header />} />
        </div>
    );
};
