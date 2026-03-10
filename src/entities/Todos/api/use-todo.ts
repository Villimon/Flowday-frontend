import { useQuery } from '@tanstack/react-query';
import { fetchTodo } from '@/entities/Todos/api/fetch-todo';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';

export const useTodos = () => {
    return useQuery({
        queryKey: TODO_KEYS.lists(),
        queryFn: fetchTodo,
        retryOnMount: false,
        refetchOnWindowFocus: false,
    });
};
