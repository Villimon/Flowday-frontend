import { $api } from '@/shared/api/api';
import { LabelResponseDto } from '../model/types/types';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';

export const fetchLabels = async () => {
    try {
        const { data } = await $api.get<LabelResponseDto>('/labels');
        return data;
    } catch (e) {
        const error = e as AxiosError<ApiError>;
        throw error.response?.data || { success: false, message: 'Ошибка получения меток' };
    }
};
