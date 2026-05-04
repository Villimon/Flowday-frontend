import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { LabelCreateDto, LabelCreateResponseDto } from '../model/types/types';
import { LabelFormData } from '../model/schema/schema';
import { LABEL_KEYS } from '@/shared/api/keys-factories/create-label-factories';

export const useCreateLabel = () => {
    const queryClient = useQueryClient();

    return useMutation<LabelCreateDto, ApiError, LabelFormData>({
        mutationFn: async (dto: LabelCreateDto) => {
            try {
                const { data } = await $api.post<LabelCreateResponseDto>('/labels', dto);
                return data.data;
            } catch (e) {
                const error = e as AxiosError<ApiError>;
                throw (
                    error.response?.data || {
                        success: false,
                        message: 'Ошибка при создание метки',
                    }
                );
            }
        },
        onSuccess: async newLabel => {
            await queryClient.invalidateQueries({ queryKey: LABEL_KEYS.lists() });
            return newLabel;
        },
    });
};
