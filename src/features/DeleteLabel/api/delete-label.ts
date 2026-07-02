import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteLabelResponseDto } from '../model/types/types';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { LABEL_KEYS } from '@/shared/api/keys-factories/create-label-factories';
import { Label, LabelResponseDto } from '@/entities/Label/model/types/types';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import {
    DataType,
    GetTodosDayResponse,
    GetTodosListResponse,
    Todo,
} from '@/entities/Todos/model/types/types';

export const useDeleteLabel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (labelId: string) => {
            try {
                const { data } = await $api.delete<DeleteLabelResponseDto>(`/labels/${labelId}`);
                return data;
            } catch (e) {
                const error = e as AxiosError<ApiError>;
                throw (
                    error.response?.data || {
                        success: false,
                        message: 'Ошибка при удаление метки',
                    }
                );
            }
        },
        onMutate: async (labelId: string) => {
            await Promise.all([
                queryClient.cancelQueries({ queryKey: LABEL_KEYS.lists() }),
                queryClient.cancelQueries({ queryKey: TODO_KEYS.lists() }),
            ]);

            const previousLabels = queryClient.getQueryData<LabelResponseDto>(LABEL_KEYS.lists());
            const previousTodosQueries = queryClient.getQueriesData<DataType>({
                queryKey: TODO_KEYS.lists(),
            });

            queryClient.setQueryData(LABEL_KEYS.lists(), (oldData: LabelResponseDto) => {
                if (!oldData?.data) return oldData;

                return {
                    ...oldData,
                    data: oldData.data.filter((label: Label) => label.id !== labelId),
                };
            });

            queryClient.setQueriesData<DataType>({ queryKey: TODO_KEYS.lists() }, old => {
                if (!old || !old.todos) return old;

                // Хелпер для фильтрации меток внутри массива задач
                const filterLabelsInArray = (arr: Todo[]) =>
                    arr.map(todo => ({
                        ...todo,
                        labels: todo.labels?.filter(l => l.id !== labelId) || [],
                    }));

                if ('withDate' in old.todos) {
                    return {
                        ...old,
                        todos: {
                            withDate: filterLabelsInArray(old.todos.withDate),
                            withoutDate: filterLabelsInArray(old.todos.withoutDate),
                        },
                    } as GetTodosDayResponse;
                }

                if ('today' in old.todos) {
                    return {
                        ...old,
                        todos: {
                            overdue: filterLabelsInArray(old.todos.overdue),
                            today: filterLabelsInArray(old.todos.today),
                            thisWeek: filterLabelsInArray(old.todos.thisWeek),
                            upcoming: filterLabelsInArray(old.todos.upcoming),
                            withoutDate: filterLabelsInArray(old.todos.withoutDate),
                            completed: filterLabelsInArray(old.todos.completed),
                        },
                    } as GetTodosListResponse;
                }

                return old;
            });

            return { previousLabels, previousTodosQueries };
        },
        onError: (err, _, context) => {
            if (context?.previousLabels) {
                queryClient.setQueryData(LABEL_KEYS.lists(), context.previousLabels);
            }

            if (context?.previousTodosQueries) {
                context.previousTodosQueries.forEach(([queryKey, queryData]) => {
                    queryClient.setQueryData(queryKey, queryData);
                });
            }
            toast.error(err.message || 'Ошибка при удаление');
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: LABEL_KEYS.lists() }),
                queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() }),
            ]);
            toast.success('Метка удалена');
        },
    });
};
