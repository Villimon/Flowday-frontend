import { $api } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TODO_KEYS } from "@/shared/api/keys-factories/create-todo-factories";
import { DeleteTodoResponseDto } from "../model/types/types";
import { TodoStatus } from "@/features/FilterTodos/model/types/types";
import { Todo, TodosResponseDto } from "@/entities/Todos/model/types/types";
import { toast } from "react-toastify";

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    const filters: TodoStatus[] = ['all', 'active', 'completed']

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
        onMutate: async (todoId: string) => {
            // Отменяем все текущие запросы для списков задач
            await queryClient.cancelQueries({ queryKey: TODO_KEYS.lists() });


            // Сохраняем предыдущие данные для всех фильтров
            const previousData = {
                all: queryClient.getQueryData(TODO_KEYS.list('all')),
                active: queryClient.getQueryData(TODO_KEYS.list('active')),
                completed: queryClient.getQueryData(TODO_KEYS.list('completed')),
            };


            filters.forEach(filter => {
                queryClient.setQueryData(
                    TODO_KEYS.list(filter),
                    (oldData: TodosResponseDto) => {
                        if (!oldData?.data) return oldData;

                        return {
                            ...oldData,
                            data: oldData.data.filter((todo: Todo) => todo.id !== todoId)
                        };
                    }
                );
            })

            return { previousData };
        },
        onError: (err, todoId, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(TODO_KEYS.list('all'), context.previousData.all);
                queryClient.setQueryData(TODO_KEYS.list('active'), context.previousData.active);
                queryClient.setQueryData(TODO_KEYS.list('completed'), context.previousData.completed);
            }
            toast.error(err.message || 'Ошибка при удаление');
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: TODO_KEYS.lists()
            });
            toast.success('Задача удалена');
        },
    });
};
