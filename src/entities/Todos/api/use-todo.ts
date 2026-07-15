import { useQuery } from '@tanstack/react-query';
import { fetchTodo, FetchTodoParams } from '@/entities/Todos/api/fetch-todo';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { TodoStatus, TodoView } from '../model/types/types';
import { format } from 'date-fns';

interface UseTodosParams {
    status: TodoStatus;
    view: TodoView;
    currentDate?: Date;
}

export const useTodos = ({ status, view, currentDate }: UseTodosParams) => {
    let formattedDate;
    const cacheFilters = [status, view] as string[];
    const queryParams: FetchTodoParams = {
        status,
        view,
    };

    if (view === 'day' && currentDate) {
        formattedDate = format(currentDate, 'yyyy-MM-dd');
        queryParams.date = formattedDate;
        cacheFilters.push(formattedDate);
    }

    const isQueryEnabled = view !== 'day' || Boolean(formattedDate);

    return useQuery({
        queryKey: [...TODO_KEYS.list(cacheFilters), queryParams],
        queryFn: () => fetchTodo(queryParams),
        retryOnMount: false,
        refetchOnWindowFocus: false,
        enabled: isQueryEnabled,
    });
};
