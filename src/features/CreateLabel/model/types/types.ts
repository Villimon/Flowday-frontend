import { Label } from '@/entities/Label/model/types/types';

export type LabelCreateDto = {
    name: string;
};

export type LabelCreateResponseDto = {
    success: boolean;
    message: string;
    data: Label;
};
