import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { LabelCreateResponseDto } from '../model/types/types';
import { LabelFormData } from '../model/schema/schema';
import { LABEL_KEYS } from '@/shared/api/keys-factories/create-label-factories';
import { Label, LabelResponseDto } from '@/entities/Label/model/types/types';

export const useCreateLabel = () => {
    const queryClient = useQueryClient();

    return useMutation<Label, ApiError, LabelFormData>({
        mutationFn: async (dto: LabelFormData) => {
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
            queryClient.setQueryData<LabelResponseDto>(LABEL_KEYS.lists(), old => {
                if (!old || !Array.isArray(old.data)) return old;

                return {
                    ...old,
                    data: [...old.data, newLabel],
                };
            });

            queryClient.invalidateQueries({
                queryKey: LABEL_KEYS.lists(),
            });
        },
    });
};
