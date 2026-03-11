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
// Настроить ацесабилити для компонентов и соблюдать симантику - в релиз 1.0.0
// Убрать все проблемы линтинга - в релиз 1.0.0

// BUGS
// Не ощищается форма при закрытие модалкиу регистрации и авторизации - в релиз 1.0.0 - МОЖНО И СДЕЛАТЬ

// Добавить страницы логина и регистрации - в релиз 1.0.0
// Сверстать главную с небольшим описанием и кнопкой в зависимости от того авторизированы мы или нет ( тут еще нужно будет добавить, что при нажатие на кнопку начать бесплатно мы будем либо редиректится на задачи либо на страницу с формой логина) - в релиз 1.0.0

// TODO
// Редактировать задачи, для этого надо получать конкретную задачу по роуту /:id, а в параметрах передать todoId

// Сделать адаптив

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
