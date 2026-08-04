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

// @tanstack/query-persist-client-core (Persist Query Client). Он сохраняет кеш приложения в IndexedDB (или localStorage).
// Работа с оффлайн режимом

/* 
TODO: для работы с разными устройстави: что делать если создал задачу на телефоне, а на компьютере ее нет (Real-Time Синхронизация)
Вариант Б: WebSockets / Server-Sent Events (SSE)
Ты спросил: «Нужно ли переводить создание и изменение задачи на WebSocket?»

Best Practice ответ: Нет, не нужно.
Очень частая ошибка — переводить абсолютно весь CRUD на WebSockets. Это усложняет обработку ошибок и форму ответов.

Правильный гибридный подход:

Запросы от пользователя на сервер (Мутации) остаются по старому доброму REST / GraphQL API (отправили POST /todos, получили отклик или 500 ошибку).

WebSocket или SSE используется только как шина уведомлений (Event Stream).

Когда на телефоне пользователь создает задачу, бэкенд по сокету отправляет легкое событие всем другим подключенным устройствам этого пользователя: { type: 'TODO_UPDATED', todoId: '123' }.

На фронтенде наш сокет-клиент ловит это событие и вызывает метод TanStack Query:

TypeScript
// При получении события по WS мы просто сбрасываем кеш:
queryClient.invalidateQueries({ queryKey: ['todos'] });
TanStack Query сам фоном перезапрашивает список свежих данных! В итоге код остается чистым, UI обновляется мгновенно, а архитектура — предсказуемой.


*/

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
