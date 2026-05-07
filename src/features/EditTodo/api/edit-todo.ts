import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { ManageTodoResponseDto } from '@/features/ManageTodo';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { EditTodoDto } from '@/features/EditTodo/model/types/types';
import { Todo } from '@/entities/Todos';

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
        // TODO: Перейти на Success Update
        onSuccess: async newTodo => {
            await queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
            return newTodo;
        },
    });
};
