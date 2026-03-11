export interface Todo {
    id: string,
    title: string,
    description?: string,
    completed: boolean,
    userId: string,
    updatedAt: string
    createdAt: string
}

export interface TodosResponseDto {
    success: boolean;
    message: string
    data: Todo[]
}
