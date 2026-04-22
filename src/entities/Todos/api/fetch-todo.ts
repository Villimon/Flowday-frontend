import { $api } from '@/shared/api/api';
import { TodosResponseDto } from '../model/types/types';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';

interface FetchTodoParams {
    status?: string;
}

export const fetchTodo = async ({ status }: FetchTodoParams) => {
    try {
        const { data } = await $api.get<TodosResponseDto>('/todos', {
            params: {
                status,
            },
        });
        return data;
    } catch (e) {
        const error = e as AxiosError<ApiError>;
        throw error.response?.data || { success: false, message: 'Ошибка получения данных' };
    }
};
