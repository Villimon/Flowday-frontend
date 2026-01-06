import { ErrorPage } from '@/pages/ErrorPage';
import { MainPage } from '@/pages/MainPage';
import { TodosPage } from '@/pages/TodosPage';
import { AppRoutes, getRouteMain, getRouteTodos } from '@/shared/constants/router';
import { RouteProps } from 'react-router-dom';

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: getRouteMain(),
        element: <MainPage />,
    },
    [AppRoutes.TODOS]: {
        path: getRouteTodos(),
        element: <TodosPage />,
        authOnly: true,
    },
    [AppRoutes.NOT_FOUND]: {
        path: '*',
        element: <ErrorPage />,
    },
};
