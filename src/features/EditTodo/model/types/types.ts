import { ManageTodoDto } from '@/features/ManageTodo';

export interface EditTodoDto {
    todo: ManageTodoDto;
    todoId: string;
}
