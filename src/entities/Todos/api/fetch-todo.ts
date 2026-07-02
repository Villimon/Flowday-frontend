import { $api } from '@/shared/api/api';
import { TodosResponseDto, TodoStatus, TodoView } from '../model/types/types';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';

export interface FetchTodoParams {
    status: TodoStatus;
    view: TodoView;
    date?: string;
}

export const fetchTodo = async ({ status, view, date }: FetchTodoParams) => {
    try {
        const response = await $api.get<TodosResponseDto>('/todos', {
            params: {
                status,
                view,
                date,
            },
        });

        return response.data.data;
    } catch (e) {
        const error = e as AxiosError<ApiError>;
        throw error.response?.data || { success: false, message: 'Ошибка получения данных' };
    }
};
