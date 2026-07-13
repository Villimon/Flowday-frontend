import { Todo } from '@/entities/Todos';

export interface PositionedTodo extends Todo {
    top: number;
    height: number;
    leftPercent?: number;
    widthPercent?: number;
}
