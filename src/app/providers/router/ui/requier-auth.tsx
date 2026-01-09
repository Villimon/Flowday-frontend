import { useAuth } from '@/entities/User';
import { getRouteMain } from '@/shared/constants/router';
import { FC, JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequierAuthProps {
    children: JSX.Element;
}

export const RequierAuth: FC<RequierAuthProps> = ({ children }) => {
    const { data: user } = useAuth();
    const isAuth = Boolean(user);
    const location = useLocation();

    if (!isAuth) {
        return <Navigate to={getRouteMain()} state={{ from: location }} replace />;
    }

    return children;
};
