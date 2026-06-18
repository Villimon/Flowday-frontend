import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { ManageTodoResponseDto } from '@/features/ManageTodo';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { TodoFormData } from '@/features/ManageTodo/model/schema/schema';
import { Todo, TodosResponseDto } from '@/entities/Todos/model/types/types';
import { Label, LabelResponseDto } from '@/entities/Label/model/types/types';
import { LABEL_KEYS } from '@/shared/api/keys-factories/create-label-factories';

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
            const allLabelsInCache = queryClient.getQueryData<LabelResponseDto>(LABEL_KEYS.lists());
            const labelsList = allLabelsInCache?.data || [];

            const populatedLabels = newTodo?.labels
                ?.map(labelIdOrObj => {
                    if (typeof labelIdOrObj === 'object') return labelIdOrObj;

                    return labelsList.find(l => l.id === labelIdOrObj);
                })
                .filter((label): label is Label => !!label);

            const fullTodo = {
                ...newTodo,
                labels: populatedLabels,
            };

            queryClient.setQueryData<TodosResponseDto>(TODO_KEYS.list('all'), old => {
                if (!old || !Array.isArray(old.data)) return old;

                return {
                    ...old,
                    data: [fullTodo, ...old.data],
                };
            });

            queryClient.setQueryData<TodosResponseDto>(TODO_KEYS.list('active'), old => {
                if (!old || !Array.isArray(old.data)) return old;

                return {
                    ...old,
                    data: [fullTodo, ...old.data],
                };
            });

            queryClient.invalidateQueries({
                queryKey: TODO_KEYS.lists(),
            });
        },
    });
};
