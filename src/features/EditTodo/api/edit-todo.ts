import { $api } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TODO_KEYS } from "@/shared/api/keys-factories/create-todo-factories";
import { ManageTodoDto, ManageTodoResponseDto } from "@/features/ManageTodo";

export const useEditTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ todo, todoId }: { todo: ManageTodoDto, todoId: string }) => {
            try {
                const { data } = await $api.put<ManageTodoResponseDto>(`/todos/${todoId}`, todo);
                return data.data;
            } catch (error: any) {
                const serverMessage = error?.response?.data?.message || 'Ошибка при обновлении задачи';
                throw new Error(serverMessage);
            }
        },
        onSuccess: async newTodo => {
            await queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
            return newTodo
        },
    });
};
