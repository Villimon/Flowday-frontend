import { $api } from '@/shared/api/api';
import { TodosResponseDto } from '../model/types/types';

interface FetchTodoParams {
    filter?: string
}

export const fetchTodo = async ({ filter }: FetchTodoParams) => {
    try {
        const { data } = await $api.get<TodosResponseDto>('/todos', {
            params: {
                filter
            }
        });
        return data;
    } catch (e: any) {
        const serverMessage = e?.response?.data?.message || 'Ошибка получение данных';
        throw new Error(serverMessage);
    }
};
