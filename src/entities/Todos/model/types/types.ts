import { Label } from '@/entities/Label/model/types/types';

export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    userId: string;
    updatedAt: string;
    createdAt: string;
    labels?: Label[];
}

export interface TodosResponseDto {
    success: boolean;
    message: string;
    data: Todo[];
}
