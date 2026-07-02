import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { ManageTodoResponseDto } from '@/features/ManageTodo';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { TodoFormData } from '@/features/ManageTodo/model/schema/schema';
import {
    DataType,
    GetTodosDayResponse,
    GetTodosListResponse,
    Todo,
} from '@/entities/Todos/model/types/types';
import { sortTodosForClient } from '@/shared/lib/sortTodosForClient';
import { getTodoCategory } from '@/entities/Todos';

export const useCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation<Todo, ApiError, TodoFormData>({
        mutationFn: async (dto: TodoFormData) => {
            try {
                const { data } = await $api.post<ManageTodoResponseDto>('/todos', dto);
                return data.data;
            } catch (e) {
                const error = e as AxiosError<ApiError>;
                throw (
                    error.response?.data || {
                        success: false,
                        message: 'Ошибка при создание задачи',
                    }
                );
            }
        },
        onSuccess: async newTodo => {
            queryClient.setQueriesData<DataType>({ queryKey: TODO_KEYS.lists() }, old => {
                if (!old || !old.todos) return old;

                // --- ВАРИАНТ 1: Если это кэш РЕЖИМА ДНЯ ---
                if ('withDate' in old.todos) {
                    const isWithoutDate = !newTodo.startDate;

                    return {
                        ...old,
                        counts: {
                            ...old.counts,
                            all: old.counts.all + 1,
                            active: old.counts.active + 1,
                        },
                        todos: {
                            ...old.todos,
                            withDate: !isWithoutDate
                                ? [newTodo, ...old.todos.withDate]
                                : old.todos.withDate,
                            withoutDate: isWithoutDate
                                ? [newTodo, ...old.todos.withoutDate]
                                : old.todos.withoutDate,
                        },
                    } as GetTodosDayResponse;
                }

                // --- ВАРИАНТ 2: Если это кэш РЕЖИМА СПИСКА (GetTodosListResponse) ---
                if ('today' in old.todos) {
                    const category = getTodoCategory(newTodo);

                    return {
                        ...old,
                        counts: {
                            ...old.counts,
                            all: old.counts.all + 1,
                            active: old.counts.active + 1,
                        },
                        todos: {
                            ...old.todos,
                            [category]: sortTodosForClient([newTodo, ...old.todos[category]]),
                        },
                    } as GetTodosListResponse;
                }

                return old;
            });

            queryClient.invalidateQueries({
                queryKey: TODO_KEYS.lists(),
            });
        },
    });
};
