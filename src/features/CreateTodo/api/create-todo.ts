import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { ManageTodoDto, ManageTodoResponseDto } from '@/features/ManageTodo';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { TodoFormData } from '@/features/ManageTodo/model/schema/schema';

export const useCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation<ManageTodoDto, ApiError, TodoFormData>({
        mutationFn: async (dto: ManageTodoDto) => {
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
        // TODO: Перейти на Success Update
        onSuccess: async newTodo => {
            await queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
            return newTodo;

            /* 
            // Обновляем список 'all', так как новая задача точно там будет
            queryClient.setQueryData(TODO_KEYS.list('all'), (old: any) => {
                if (!old?.data) return old;
                return { ...old, data: [newTodo, ...old.data] }; // Добавляем в начало
            });

            // Опционально: если задача 'active' (а новая обычно такая), 
            // можно обновить и ключ 'active'.
            // Но проще сделать invalidate для остальных, чтобы не плодить логику.
            queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
            
            */
        },
    });
};
