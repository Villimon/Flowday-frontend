export type CreateTodoDto = {
    title: string;
    description?: string;
};

export interface Todo {
    id: string,
    title: string,
    description?: string,
    completed: boolean,
    userId: string,
}

export type CreateTodoResponseDto = {
    success: boolean,
    message: string,
    data: Todo
};
