import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React, { Suspense } from 'react';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Контейнер root не найден. НЕ удалось вмонтировать реакт приложение');
}

const root = createRoot(container);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 5 * 60 * 1000,
            staleTime: 5 * 60 * 1000,
        },
    },
});

const ReactQueryDevtools = import.meta.env.PROD
    ? () => null
    : React.lazy(() =>
          import('@tanstack/react-query-devtools').then(res => ({
              default: res.ReactQueryDevtools,
          }))
      );

root.render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <App />
            {import.meta.env.DEV && (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            )}
        </QueryClientProvider>
    </BrowserRouter>
);
