import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteLabelResponseDto } from '../model/types/types';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { LABEL_KEYS } from '@/shared/api/keys-factories/create-label-factories';
import { Label, LabelResponseDto } from '@/entities/Label/model/types/types';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { TodosResponseDto } from '@/entities/Todos/model/types/types';

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
            const previousTodos = queryClient.getQueryData<TodosResponseDto>(TODO_KEYS.lists());

            queryClient.setQueryData(LABEL_KEYS.lists(), (oldData: LabelResponseDto) => {
                if (!oldData?.data) return oldData;

                return {
                    ...oldData,
                    data: oldData.data.filter((label: Label) => label.id !== labelId),
                };
            });

            queryClient.setQueryData<TodosResponseDto>(TODO_KEYS.lists(), oldData => {
                if (!oldData?.data) return oldData;

                return {
                    ...oldData,
                    data: oldData.data.map(todo => ({
                        ...todo,
                        labels: todo.labels?.filter((label: Label) => label.id !== labelId) || [],
                    })),
                };
            });

            return { previousLabels, previousTodos };
        },
        onError: (err, _, context) => {
            if (context?.previousLabels) {
                queryClient.setQueryData(LABEL_KEYS.lists(), context.previousLabels);
            }
            if (context?.previousTodos) {
                queryClient.setQueryData(TODO_KEYS.lists(), context.previousTodos);
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
