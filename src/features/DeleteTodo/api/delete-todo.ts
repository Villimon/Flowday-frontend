import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { DeleteTodoResponseDto } from '../model/types/types';
import {
    DataType,
    GetTodosDayResponse,
    GetTodosListResponse,
    Todo,
} from '@/entities/Todos/model/types/types';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (todoId: string) => {
            try {
                const { data } = await $api.delete<DeleteTodoResponseDto>(`/todos/${todoId}`);
                return data;
            } catch (e) {
                const error = e as AxiosError<ApiError>;
                throw (
                    error.response?.data || {
                        success: false,
                        message: 'Ошибка при удаление задачи',
                    }
                );
            }
        },
        onMutate: async (todoId: string) => {
            // 1. Отменяем все текущие запросы для списков задач, чтобы они не перезаписали наш оптимистичный кэш
            await queryClient.cancelQueries({ queryKey: TODO_KEYS.lists() });

            // 2. Делаем бэкап ВСЕХ активных динамических кэшей списков задач
            const previousTodosQueries = queryClient.getQueriesData<DataType>({
                queryKey: TODO_KEYS.lists(),
            });

            // Нам нужно узнать, была ли удаляемая задача выполнена, чтобы правильно скорректировать счетчики.
            // Поищем её в любом из кэшей. Если не найдем, по умолчанию будем считать активной.
            let isTodoCompleted = false;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const [_, queryData] of previousTodosQueries) {
                if (!queryData?.todos) continue;

                // Ищем задачу в доступных массивах
                const foundInDay =
                    'withDate' in queryData.todos
                        ? [...queryData.todos.withDate, ...queryData.todos.withoutDate].find(
                              t => t.id === todoId
                          )
                        : null;

                const foundInList =
                    'today' in queryData.todos
                        ? Object.values(queryData.todos)
                              .flat()
                              .find(t => (t as Todo).id === todoId)
                        : null;

                const todo = foundInDay || foundInList;
                if (todo) {
                    isTodoCompleted = (todo as Todo).completed;
                    break;
                }
            }

            // 3. Оптимистично удаляем задачу из всех кэшей
            queryClient.setQueriesData<DataType>({ queryKey: TODO_KEYS.lists() }, old => {
                if (!old || !old.todos) return old;

                // Хелпер для фильтрации удаляемой задачи из массивов
                const filterArray = (arr: Todo[]) => arr.filter(todo => todo.id !== todoId);

                // Флаг: уменьшился ли размер массивов (чтобы не декрементировать счетчик дважды)
                let wasDeleted = false;

                if ('withDate' in old.todos) {
                    const cleanWithDate = filterArray(old.todos.withDate);
                    const cleanWithoutDate = filterArray(old.todos.withoutDate);

                    wasDeleted =
                        cleanWithDate.length < old.todos.withDate.length ||
                        cleanWithoutDate.length < old.todos.withoutDate.length;

                    return {
                        ...old,
                        counts: wasDeleted
                            ? {
                                  ...old.counts,
                                  all: Math.max(0, old.counts.all - 1),
                                  active: !isTodoCompleted
                                      ? Math.max(0, old.counts.active - 1)
                                      : old.counts.active,
                                  completed: isTodoCompleted
                                      ? Math.max(0, old.counts.completed - 1)
                                      : old.counts.completed,
                              }
                            : old.counts,
                        todos: {
                            withDate: cleanWithDate,
                            withoutDate: cleanWithoutDate,
                        },
                    } as GetTodosDayResponse;
                }

                if ('today' in old.todos) {
                    const cleanOverdue = filterArray(old.todos.overdue);
                    const cleanToday = filterArray(old.todos.today);
                    const cleanThisWeek = filterArray(old.todos.thisWeek);
                    const cleanUpcoming = filterArray(old.todos.upcoming);
                    const cleanWithoutDate = filterArray(old.todos.withoutDate);
                    const cleanCompleted = filterArray(old.todos.completed);

                    wasDeleted =
                        cleanOverdue.length < old.todos.overdue.length ||
                        cleanToday.length < old.todos.today.length ||
                        cleanThisWeek.length < old.todos.thisWeek.length ||
                        cleanUpcoming.length < old.todos.upcoming.length ||
                        cleanWithoutDate.length < old.todos.withoutDate.length ||
                        cleanCompleted.length < old.todos.completed.length;

                    return {
                        ...old,
                        counts: wasDeleted
                            ? {
                                  ...old.counts,
                                  all: Math.max(0, old.counts.all - 1),
                                  active: !isTodoCompleted
                                      ? Math.max(0, old.counts.active - 1)
                                      : old.counts.active,
                                  completed: isTodoCompleted
                                      ? Math.max(0, old.counts.completed - 1)
                                      : old.counts.completed,
                              }
                            : old.counts,
                        todos: {
                            overdue: cleanOverdue,
                            today: cleanToday,
                            thisWeek: cleanThisWeek,
                            upcoming: cleanUpcoming,
                            withoutDate: cleanWithoutDate,
                            completed: cleanCompleted,
                        },
                    } as GetTodosListResponse;
                }

                return old;
            });

            // Возвращаем сохраненные кэши для отката при ошибке
            return { previousTodosQueries };
        },
        onError: (err, _, context) => {
            // Если сервер ответил ошибкой, восстанавливаем каждый кэш по его полному оригинальному ключу
            if (context?.previousTodosQueries) {
                context.previousTodosQueries.forEach(([queryKey, queryData]) => {
                    queryClient.setQueryData(queryKey, queryData);
                });
            }
            toast.error(err.message || 'Ошибка при удалении задачи');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TODO_KEYS.lists(),
            });
            toast.success('Задача удалена');
        },
    });
};
