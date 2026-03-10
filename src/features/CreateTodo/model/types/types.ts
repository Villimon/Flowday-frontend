import { Todo } from "@/entities/Todos";

export type CreateTodoDto = {
    title: string;
    description?: string;
};


export type CreateTodoResponseDto = {
    success: boolean,
    message: string,
    data: Todo
};
