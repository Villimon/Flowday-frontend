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
import { Chip } from '@/shared/ui/Chip/Chip';

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
            radius="xl"
            variant="filled"
            className={clsx(styles.todoCard, {
                [styles.completed]: todo.completed && status === 'all',
            })}
            onClick={handleToggleTodo}
            lang="ru"
        >
            <HStack gap="8" align="start" className={styles.body}>
                <Icon
                    aria-label={
                        todo.completed ? 'Отметить как невыполненное' : 'Отметить как выполненное'
                    }
                    Svg={todo.completed ? CircleCheckIcon : CircleIcon}
                    color="primary"
                    className={styles.icon}
                />
                <VStack fullWidth gap="2">
                    <HStack align="center" gap="2" wrap="wrap">
                        <Text
                            title={`${todo.title.charAt(0).toUpperCase()}${todo.title.slice(1)}`}
                            size="xl"
                        />
                        {todo.labels?.map(label => {
                            const style = {
                                backgroundColor: `color-mix(in srgb, ${label.color}, transparent 80%)`,
                                color: label.color,
                                borderColor: label.color,
                            };

                            return (
                                <Chip key={label.id} label={label.name} size="xs" style={style} />
                            );
                        })}
                    </HStack>
                    {todo.description && <Text text={todo.description} variant="secondary" />}
                </VStack>
                <Card className={styles.buttons} radius="xl">
                    <HStack
                        justify="center"
                        align="center"
                        onClick={e => e.stopPropagation()}
                        gap="2"
                    >
                        <EditTodo todo={todo} />
                        <DeleteTodo todoId={todo.id} />
                    </HStack>
                </Card>
            </HStack>
        </Card>
    );
};
