import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { ToggleTodoResponseDto } from '../model/types/types';
import { Todo } from '@/entities/Todos';
import { TodoStatus } from '@/features/FilterTodos/model/types/types';
import { TodosResponseDto } from '@/entities/Todos/model/types/types';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';

export const useToggleTodo = () => {
    const queryClient = useQueryClient();
    const filters: TodoStatus[] = ['all', 'active', 'completed'];
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
            // Отменяем все текущие запросы для списков задач
            await queryClient.cancelQueries({ queryKey: TODO_KEYS.lists() });

            // Сохраняем предыдущие данные для всех фильтров
            const previousData = {
                all: queryClient.getQueryData(TODO_KEYS.list('all')),
                active: queryClient.getQueryData(TODO_KEYS.list('active')),
                completed: queryClient.getQueryData(TODO_KEYS.list('completed')),
            };

            const newStatus = !updatedTodo.completed;

            filters.forEach(filter => {
                queryClient.setQueryData(TODO_KEYS.list(filter), (old: TodosResponseDto) => {
                    if (!old?.data) return old;

                    let updatedList = [...old.data];

                    if (filter === 'all') {
                        // В "Все" просто обновляем и сортируем
                        updatedList = updatedList.map(t =>
                            t.id === updatedTodo.id
                                ? {
                                      ...t,
                                      completed: newStatus,
                                      updatedAt: new Date().toISOString(),
                                  }
                                : t
                        );
                    } else if (filter === 'active') {
                        // Если стала выполненной — удаляем из активных
                        updatedList = newStatus
                            ? updatedList.filter(t => t.id !== updatedTodo.id)
                            : [...updatedList, { ...updatedTodo, completed: newStatus }];
                    } else if (filter === 'completed') {
                        // Если стала активной — удаляем из выполненных
                        updatedList = !newStatus
                            ? updatedList.filter(t => t.id !== updatedTodo.id)
                            : [...updatedList, { ...updatedTodo, completed: newStatus }];
                    }

                    return { ...old, data: sortTodosByFilter(updatedList, filter) };
                });
            });

            return { previousData };
        },
        onError: (_, __, context) => {
            // Восстанавливаем все фильтры при ошибке
            if (context?.previousData) {
                queryClient.setQueryData(TODO_KEYS.list('all'), context.previousData.all);
                queryClient.setQueryData(TODO_KEYS.list('active'), context.previousData.active);
                queryClient.setQueryData(
                    TODO_KEYS.list('completed'),
                    context.previousData.completed
                );
            }
        },
        onSettled: () => {
            const activeMutations = queryClient.isMutating({ mutationKey });

            if (activeMutations === 0) {
                queryClient.invalidateQueries({
                    queryKey: TODO_KEYS.lists(),
                    refetchType: 'active',
                });
            }
        },
    });
};

const sortTodosByFilter = (todos: Todo[], filter: string): Todo[] => {
    // Разделяем на активные и выполненные
    const activeTodos = todos.filter(t => !t.completed);
    const completedTodos = todos.filter(t => t.completed);

    // Сортируем активные по createdAt (новые сверху)
    activeTodos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Сортируем выполненные по updatedAt (новые сверху)
    completedTodos.sort((a, b) => {
        const aDate = a.updatedAt || a.createdAt;
        const bDate = b.updatedAt || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

    // Возвращаем в зависимости от фильтра
    switch (filter) {
        case 'active':
            return activeTodos;
        case 'completed':
            return completedTodos;
        default:
            return [...activeTodos, ...completedTodos];
    }
};
