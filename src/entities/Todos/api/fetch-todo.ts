import { $api } from '@/shared/api/api';
import { TodosResponseDto } from '../model/types/types';

export const fetchTodo = async () => {
    try {
        const { data } = await $api.get<TodosResponseDto>('/todos');
        return data;
    } catch (e: any) {
        const serverMessage = e?.response?.data?.message || 'Ошибка получение данных';
        throw new Error(serverMessage);
    }
};
