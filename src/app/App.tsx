import { MainLayout } from '@/shared/layouts/main-layout';
import { AppRouter } from './providers/router';
import './styles/index.css';
import { Header } from '@/widgets/Header';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// GLOBAL TODO:
// Настроить мета данные для SEO
// Наставивать ацесабилити для компонентов и соблюдать симантику

// BUGS
// Не ощищается форма при закрытие модалкиу регистрации и авторизации

// TODO
// Сверстать главную с небольшим описанием и кнопкой в зависимости от того авторизированы мы или нет
// Сделать компонент табов

// Создать форму по созданию задачи
// Получать задачи
// Сортировать задавчи

// Редактировать задачи
// Удалять задачи
// Менять статус задачи

// Сделать адаптив

export const App = () => {
    return (
        <div className="app">
            <MainLayout content={<AppRouter />} header={<Header />} />
            <ToastContainer />
        </div>
    );
};
