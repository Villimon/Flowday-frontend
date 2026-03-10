import { useQuery } from '@tanstack/react-query';
import { fetchTodo } from '@/entities/Todos/api/fetch-todo';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';

interface UseTodosParams {
    filter?: string
}

export const useTodos = ({ filter = 'all' }: UseTodosParams) => {
    return useQuery({
        queryKey: TODO_KEYS.list(filter),
        queryFn: () => fetchTodo({ filter }),
        retryOnMount: false,
        refetchOnWindowFocus: false,
    });
};
