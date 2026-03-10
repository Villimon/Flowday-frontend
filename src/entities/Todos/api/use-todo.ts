import { useQuery } from '@tanstack/react-query';
import { fetchTodo } from '@/entities/Todos/api/fetch-todo';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';

interface UseTodosParams {
    status?: string
}

export const useTodos = ({ status = 'all' }: UseTodosParams) => {
    return useQuery({
        queryKey: TODO_KEYS.list(status),
        queryFn: () => fetchTodo({ status }),
        retryOnMount: false,
        refetchOnWindowFocus: false,
    });
};
