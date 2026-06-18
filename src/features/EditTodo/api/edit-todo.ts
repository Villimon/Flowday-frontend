import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { ManageTodoResponseDto } from '@/features/ManageTodo';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { EditTodoDto } from '@/features/EditTodo/model/types/types';
import { Todo } from '@/entities/Todos';
import { Label, LabelResponseDto } from '@/entities/Label/model/types/types';
import { LABEL_KEYS } from '@/shared/api/keys-factories/create-label-factories';
import { TodosResponseDto, TodoStatus } from '@/entities/Todos/model/types/types';

export const useEditTodo = () => {
    const queryClient = useQueryClient();

    return useMutation<Todo, ApiError, EditTodoDto>({
        mutationFn: async (dto: EditTodoDto) => {
            try {
                const { data } = await $api.put<ManageTodoResponseDto>(
                    `/todos/${dto.todoId}`,
                    dto.todo
                );
                return data.data;
            } catch (e) {
                const error = e as AxiosError<ApiError>;
                throw (
                    error.response?.data || {
                        success: false,
                        message: 'Ошибка при обновлении задачи',
                    }
                );
            }
        },
        onSuccess: async updatedTodo => {
            const allLabelsInCache = queryClient.getQueryData<LabelResponseDto>(LABEL_KEYS.lists());
            const labelsList = allLabelsInCache?.data || [];

            const populatedLabels = updatedTodo?.labels
                ?.map(labelIdOrObj => {
                    if (typeof labelIdOrObj === 'object') return labelIdOrObj;

                    return labelsList.find(l => l.id === labelIdOrObj);
                })
                .filter((label): label is Label => !!label);

            const fullTodo = {
                ...updatedTodo,
                labels: populatedLabels,
            };

            const filters: TodoStatus[] = ['all', 'active', 'completed'] as const;

            filters.forEach(filter => {
                queryClient.setQueryData<TodosResponseDto>(TODO_KEYS.list(filter), old => {
                    if (!old || !Array.isArray(old.data)) return old;

                    return {
                        ...old,
                        data: old.data.map(todo => (todo.id === fullTodo.id ? fullTodo : todo)),
                    };
                });
            });

            queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
        },
    });
};
