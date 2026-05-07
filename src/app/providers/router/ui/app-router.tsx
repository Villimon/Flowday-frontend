import { Suspense, useCallback } from 'react';
import { AppRoutesProps, routeConfig } from '../config/route-config';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RequierAuth } from './requier-auth';
import { Loader } from '@/shared/ui/Loader/Loader';

export const AppRouter = () => {
    const { key } = useLocation();

    const renderWithWrapper = useCallback((route: AppRoutesProps) => {
        const content = route.authOnly ? <RequierAuth>{route.element}</RequierAuth> : route.element;

        return <Route key={route.path} path={route.path} element={content} />;
    }, []);

    return (
        <Suspense key={key} fallback={<Loader />}>
            <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>
        </Suspense>
    );
};
