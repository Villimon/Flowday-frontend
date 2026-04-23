import { Suspense, useCallback } from 'react';
import { AppRoutesProps, routeConfig } from '../config/route-config';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RequierAuth } from './requier-auth';
import { Loader } from '@/shared/ui/Loader/Loader';

export const AppRouter = () => {
    const { key } = useLocation();

    const renderWithWrapper = useCallback((route: AppRoutesProps) => {
        const element = <div>{route.element}</div>;

        return (
            <Route
                key={route.path}
                path={route.path}
                element={route.authOnly ? <RequierAuth>{element}</RequierAuth> : element}
            />
        );
    }, []);

    return (
        <Suspense key={key} fallback={<Loader />}>
            <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>
        </Suspense>
    );
};
