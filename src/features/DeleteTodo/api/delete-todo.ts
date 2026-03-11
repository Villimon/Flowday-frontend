import { $api } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TODO_KEYS } from "@/shared/api/keys-factories/create-todo-factories";
import { DeleteTodoResponseDto } from "../model/types/types";

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (todoId: string) => {
            try {
                const { data } = await $api.delete<DeleteTodoResponseDto>(`/todos/${todoId}`);
                return data;
            } catch (error: any) {
                const serverMessage = error?.response?.data?.message || 'Ошибка при удаление задачи';
                throw new Error(serverMessage);
            }
        },
        onSuccess: todo => {
            queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
        },
    });
};
