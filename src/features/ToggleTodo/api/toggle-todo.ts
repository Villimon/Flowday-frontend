import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { ToggleTodoResponseDto } from '../model/types/types';
import { getTodoCategory, Todo } from '@/entities/Todos';
import {
    DataType,
    GetTodosDayResponse,
    GetTodosListResponse,
} from '@/entities/Todos/model/types/types';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { sortTodosForClient } from '@/shared/lib/sortTodosForClient';

export const useToggleTodo = () => {
    const queryClient = useQueryClient();
    const mutationKey = ['toggle-todo'];

    return useMutation({
        mutationKey,
        mutationFn: async (todo: Todo) => {
            try {
                const { data } = await $api.patch<ToggleTodoResponseDto>(
                    `/todos/${todo.id}/toggle`
                );
                return data.data;
            } catch (e) {
                const error = e as AxiosError<ApiError>;
                throw (
                    error.response?.data || {
                        success: false,
                        message: 'Ошибка при изменении статуса задачи',
                    }
                );
            }
        },
        onMutate: async (updatedTodo: Todo) => {
            // 1. Отменяем текущие запросы, чтобы они не затерли оптимистичный результат
            await queryClient.cancelQueries({ queryKey: TODO_KEYS.lists() });

            // 2. Бэкапим ВСЕ активные динамические кэши списков задач
            const previousTodosQueries = queryClient.getQueriesData<DataType>({
                queryKey: TODO_KEYS.lists(),
            });

            // Вычисляем новый статус
            const newStatus = !updatedTodo.completed;

            // 3. Оптимистично обновляем кэши
            queryClient.setQueriesData<DataType>({ queryKey: TODO_KEYS.lists() }, old => {
                if (!old || !old.todos) return old;

                const todoId = updatedTodo.id;

                // Считаем новые счетчики
                const updatedCounts = {
                    ...old.counts,
                    active: newStatus ? Math.max(0, old.counts.active - 1) : old.counts.active + 1,
                    completed: newStatus
                        ? old.counts.completed + 1
                        : Math.max(0, old.counts.completed - 1),
                };

                if ('withDate' in old.todos) {
                    const toggleAndSortArray = (arr: Todo[]) => {
                        const hasTodo = arr.some(t => t.id === todoId);
                        if (!hasTodo) return arr;

                        const updated = arr.map(t =>
                            t.id === todoId
                                ? {
                                      ...t,
                                      completed: newStatus,
                                      updatedAt: new Date().toISOString(),
                                  }
                                : t
                        );
                        return sortTodosForClient(updated);
                    };

                    return {
                        ...old,
                        counts: updatedCounts,
                        todos: {
                            withDate: toggleAndSortArray(old.todos.withDate),
                            withoutDate: toggleAndSortArray(old.todos.withoutDate),
                        },
                    } as GetTodosDayResponse;
                }

                if ('today' in old.todos) {
                    const allArrays = [
                        ...old.todos.overdue,
                        ...old.todos.today,
                        ...old.todos.thisWeek,
                        ...old.todos.upcoming,
                        ...old.todos.withoutDate,
                        ...old.todos.completed,
                    ];

                    const targetRaw = allArrays.find(t => t.id === todoId);
                    if (!targetRaw) return old;

                    // Создаем обновленный объект задачи
                    const foundTodo: Todo = {
                        ...targetRaw,
                        completed: newStatus,
                        updatedAt: new Date().toISOString(),
                    };

                    const filterOutTodo = (arr: Todo[]) => arr.filter(t => t.id !== todoId);

                    const cleanTodos = {
                        overdue: filterOutTodo(old.todos.overdue),
                        today: filterOutTodo(old.todos.today),
                        thisWeek: filterOutTodo(old.todos.thisWeek),
                        upcoming: filterOutTodo(old.todos.upcoming),
                        withoutDate: filterOutTodo(old.todos.withoutDate),
                        completed: filterOutTodo(old.todos.completed),
                    };

                    if (newStatus) {
                        cleanTodos.completed = sortTodosForClient([
                            foundTodo,
                            ...cleanTodos.completed,
                        ]);
                    } else {
                        const targetCategory = getTodoCategory(foundTodo);
                        cleanTodos[targetCategory] = sortTodosForClient([
                            foundTodo,
                            ...cleanTodos[targetCategory],
                        ]);
                    }

                    return {
                        ...old,
                        counts: updatedCounts,
                        todos: cleanTodos,
                    } as GetTodosListResponse;
                }

                return old;
            });

            return { previousTodosQueries };
        },
        onError: (_, __, context) => {
            if (context?.previousTodosQueries) {
                context.previousTodosQueries.forEach(([queryKey, queryData]) => {
                    queryClient.setQueryData(queryKey, queryData);
                });
            }
        },
        onSettled: () => {
            const activeMutations = queryClient.isMutating({ mutationKey });

            // Если нет других параллельных мутаций этого типа, инвалидируем данные
            if (activeMutations <= 1) {
                queryClient.invalidateQueries({
                    queryKey: TODO_KEYS.lists(),
                    refetchType: 'active',
                });
            }
        },
    });
};
