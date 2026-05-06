import { useAuth } from '@/entities/User';
import { getRouteMain } from '@/shared/constants/router';
import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequierAuthProps {
    children: ReactNode;
}

export const RequierAuth: FC<RequierAuthProps> = ({ children }) => {
    const { isAuth } = useAuth();
    const location = useLocation();

    if (!isAuth) {
        return <Navigate to={getRouteMain()} state={{ from: location }} replace />;
    }

    return children;
};
