import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Контейнер root не найден. НЕ удалось вмонтировать реакт приложение');
}

const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </BrowserRouter>
);
