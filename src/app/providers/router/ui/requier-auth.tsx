import { getRouteMain } from '@/shared/constants/router';
import { FC, JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequierAuthProps {
    children: JSX.Element;
}

export const RequierAuth: FC<RequierAuthProps> = ({ children }) => {
    const auth = true;
    const location = useLocation();

    if (!auth) {
        return (
            <Navigate to={getRouteMain()} state={{ from: location }} replace />
        );
    }

    return children;
};
