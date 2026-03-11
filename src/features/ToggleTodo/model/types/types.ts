import { Todo } from "@/entities/Todos";

export type ToggleTodoResponseDto = {
    success: boolean,
    message: string,
    data: Todo
};
