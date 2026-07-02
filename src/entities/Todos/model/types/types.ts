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
    startDate?: string;
    endDate?: string;
}

export interface TodoCounts {
    all: number;
    active: number;
    completed: number;
}

export interface TodoDayData {
    withDate: Todo[];
    withoutDate: Todo[];
}

export interface TodoListData {
    overdue: Todo[];
    today: Todo[];
    thisWeek: Todo[];
    upcoming: Todo[];
    withoutDate: Todo[];
    completed: Todo[];
}

// Полный ответ для view === 'day'
export interface GetTodosDayResponse {
    counts: TodoCounts;
    todos: TodoDayData;
}

// Полный ответ для view === 'list'
export interface GetTodosListResponse {
    counts: TodoCounts;
    todos: TodoListData;
}

export type DataType = GetTodosDayResponse | GetTodosListResponse;

export interface TodosResponseDto {
    success: boolean;
    message: string;
    data: DataType;
}

export type TodoStatus = 'all' | 'active' | 'completed';
export type TodoView = 'day' | 'weel' | 'month' | 'list';
