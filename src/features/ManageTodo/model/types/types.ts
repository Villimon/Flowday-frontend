import { Todo } from "@/entities/Todos";

export type ManageTodoDto = {
    title: string;
    description?: string;
};


export type ManageTodoResponseDto = {
    success: boolean,
    message: string,
    data: Todo
};
