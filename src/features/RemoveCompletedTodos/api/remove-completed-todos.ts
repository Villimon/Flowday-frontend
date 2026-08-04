import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import {
    DataType,
    GetTodosDayResponse,
    GetTodosListResponse,
    Todo,
    TodoStatus,
    TodoView,
} from '@/entities/Todos/model/types/types';
import { RemoveCompletedTodosResponseDto } from '../model/types';
import { FetchTodoParams } from '@/entities/Todos/api/fetch-todo';
import { format } from 'date-fns';

export interface RemoveCompletedTodosParams {
    view: TodoView;
    date?: Date;
    status: TodoStatus;
}

export const useRemoveCompletedTodos = ({ view, date, status }: RemoveCompletedTodosParams) => {
    const queryClient = useQueryClient();

    let formattedDate: string;
    const cacheFilters = [status, view] as string[];

    const queryParams: FetchTodoParams = {
        status,
        view,
    };

    if (view === 'day' && date) {
        formattedDate = format(date, 'yyyy-MM-dd');
        cacheFilters.push(formattedDate);
        queryParams.date = formattedDate;
    }

    const targetQueryKey = [...TODO_KEYS.list(cacheFilters), queryParams];

    return useMutation({
        mutationFn: async () => {
            try {
                const { data } = await $api.delete<RemoveCompletedTodosResponseDto>(
                    `/todos/completed`,
                    {
                        params: {
                            view,
                            date: formattedDate,
                        },
                    }
                );
                return data;
            } catch (e) {
                const error = e as AxiosError<ApiError>;
                throw (
                    error.response?.data || {
                        success: false,
                        message: 'Ошибка при удаление задач',
                    }
                );
            }
        },
        // TODO: Поправить оптимистичный апдейт, чтобы когда мы удалили за день, у нас обновлялся и лист и наоборот, если мы удалили лист, то обновился и день
        // Логика для дня
        // Сперва мы получаем из кеша по ключу все данные
        // потому проверяем по группа ( с датой и без даты ) сколько мы удалили задач и берем общее кол-во
        // потом из переменных где храним список удаленных задач по группам собираем id задач
        // обновляем кеш дня, тут все просто, счетчик вычитаем из того что было сколько удалилил
        // и фильруем список задач
        // для списка
        // перем данные из кеша по ключу TODO_KEYS.list(['all', 'list'])
        // каунт уменьшаем на кол-во удаленных задач, как в примере с днем
        // а сами задачи фильтруем в completed по id задач что мы сохранили выше
        // Логика для листа
        // Мы везде удаляем все выполеннные задачи
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: targetQueryKey });

            const previousTodosQueries = queryClient.getQueriesData<DataType>({
                queryKey: targetQueryKey,
            });

            queryClient.setQueriesData<DataType>({ queryKey: targetQueryKey }, old => {
                if (!old || !old.todos) return old;

                const filterArray = (arr: Todo[]) => arr.filter(todo => !todo.completed);

                if ('withDate' in old.todos && view === 'day') {
                    // Оставляем только НЕвыполненные задачи
                    const cleanWithDate = filterArray(old.todos.withDate);
                    const cleanWithoutDate = filterArray(old.todos.withoutDate);

                    const removedWithDate = old.todos.withDate.filter(t => t.completed).length;
                    const removedWithoutDate = old.todos.withoutDate.filter(
                        t => t.completed
                    ).length;
                    const removedCount = removedWithDate + removedWithoutDate;

                    return {
                        ...old,
                        counts: {
                            ...old.counts,
                            all: Math.max(0, old.counts.all - removedCount),
                            completed: 0,
                        },
                        todos: {
                            withDate: cleanWithDate,
                            withoutDate: cleanWithoutDate,
                        },
                    } as GetTodosDayResponse;
                }

                if ('today' in old.todos && view === 'list') {
                    return {
                        ...old,
                        counts: {
                            ...old.counts,
                            all: Math.max(0, old.counts.all - old.counts.completed),
                            completed: 0,
                        },
                        todos: {
                            ...old.todos,
                            completed: [],
                        },
                    } as GetTodosListResponse;
                }

                return old;
            });

            return { previousTodosQueries };
        },
        onError: (err, _, context) => {
            if (context?.previousTodosQueries) {
                context.previousTodosQueries.forEach(([queryKey, queryData]) => {
                    queryClient.setQueryData(queryKey, queryData);
                });
            }
            toast.error(err.message || 'Ошибка при удалении задач');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TODO_KEYS.lists(),
            });
            toast.success('Задачи удалены');
        },
    });
};
