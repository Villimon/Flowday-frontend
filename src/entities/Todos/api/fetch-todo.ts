import { $api } from '@/shared/api/api';
import { TodosResponseDto } from '../model/types/types';

interface FetchTodoParams {
    status?: string
}

export const fetchTodo = async ({ status }: FetchTodoParams) => {
    try {
        const { data } = await $api.get<TodosResponseDto>('/todos', {
            params: {
                status
            }
        });
        return data;
    } catch (e: any) {
        const serverMessage = e?.response?.data?.message || 'Ошибка получение данных';
        throw new Error(serverMessage);
    }
};
