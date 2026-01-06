export enum AppRoutes {
  MAIN = 'main',
  TODOS = 'todos',
  NOT_FOUND = 'not_found',
}

export const getRouteMain = () => '/';
export const getRouteTodos = () => '/todos';

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteTodos()]: AppRoutes.TODOS,
};
