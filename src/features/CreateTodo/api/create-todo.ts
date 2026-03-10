import { $api } from "@/shared/api/api";
import { CreateTodoDto, CreateTodoResponseDto } from "../model/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TODO_KEYS } from "@/shared/api/keys-factories/create-todo-factories";

export const useCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: CreateTodoDto) => {
            try {
                const { data } = await $api.post<CreateTodoResponseDto>('/todos', dto);
                return data.data;
            } catch (error: any) {
                const serverMessage = error?.response?.data?.message || 'Ошибка при создание задачи';
                throw new Error(serverMessage);
            }

        },
        onSuccess: newTodo => {
            queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
        },
    });
};
