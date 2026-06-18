import { MainLayout } from '@/shared/layouts/main-layout';
import { AppRouter } from './providers/router';
import './styles/index.css';
import { Header } from '@/widgets/Header';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '@/entities/User';
import { Loader } from '@/shared/ui/Loader/Loader';
// GLOBAL TODO:
// Настроить мета данные для SEO - в релиз 1.0.0

// TODO
// Поправить некоторые TODO

export const App = () => {
    const { isInitialized } = useAuth();

    return (
        <div className="app">
            {isInitialized ? (
                <MainLayout content={<AppRouter />} header={<Header />} />
            ) : (
                <Loader />
            )}
            <ToastContainer theme="dark" position="bottom-right" newestOnTop />
        </div>
    );
};
