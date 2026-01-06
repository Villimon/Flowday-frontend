import {
  AppRoutes,
  getRouteMain,
  getRouteTodos,
} from '@/shared/constants/router';
import { RouteProps } from 'react-router-dom';

export type AppRoutesProps = RouteProps & {
  authOnly?: boolean;
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.MAIN]: {
    path: getRouteMain(),
    element: <div>MAIN</div>,
  },
  [AppRoutes.TODOS]: {
    path: getRouteTodos(),
    element: <div>TODOS</div>,
    authOnly: true,
  },
  [AppRoutes.NOT_FOUND]: {
    path: '*',
    element: <div>NOT_FOUND</div>,
  },
};
