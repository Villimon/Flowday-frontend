import { Card, HStack, Text, VStack } from '@/shared/ui';
import { Todo } from '../../model/types/types';
import { FC, useCallback } from 'react';

import styles from './todo-card.module.css';
import clsx from 'clsx';
import { DeleteTodo } from '@/features/DeleteTodo';
import { EditTodo } from '@/features/EditTodo';
import { toast } from 'react-toastify';
import { Icon } from '@/shared/ui/Icon/Icon';
import CircleIcon from '@/shared/assets/circle.svg';
import CircleCheckIcon from '@/shared/assets/circle-check.svg';
import { useToggleTodo } from '@/features/ToggleTodo';

interface TodoCardProps {
    todo: Todo;
    status: string;
}

export const TodoCard: FC<TodoCardProps> = ({ todo, status }) => {
    const { mutate: toggleTodoMutate } = useToggleTodo();

    const handleToggleTodo = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            toggleTodoMutate(todo, {
                onError: error => {
                    toast.error(error.message || 'Ошибка при изменении статуса');
                },
            });
        },
        [toggleTodoMutate, todo]
    );

    return (
        <Card
            padding="4"
            fullWidth
            className={clsx(styles.todoCard, {
                [styles.completed]: todo.completed && status === 'all',
            })}
            onClick={handleToggleTodo}
        >
            <HStack gap="8" align="start">
                <Icon
                    aria-label={
                        todo.completed ? 'Отметить как невыполненное' : 'Отметить как выполненное'
                    }
                    Svg={todo.completed ? CircleCheckIcon : CircleIcon}
                    color="primary"
                />
                <VStack fullWidth gap="2">
                    <Text
                        title={`${todo.title.charAt(0).toUpperCase()}${todo.title.slice(1)}`}
                        size="2xl"
                    />
                    {todo.description && <Text text={todo.description} variant="secondary" />}
                </VStack>
                <HStack gap="2" className={styles.buttons}>
                    <EditTodo todoId={todo.id} />
                    <DeleteTodo todoId={todo.id} />
                </HStack>
            </HStack>
        </Card>
    );
};
