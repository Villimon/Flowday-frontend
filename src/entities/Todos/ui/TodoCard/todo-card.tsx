import { Card, HStack, Text, VStack } from '@/shared/ui';
import { Todo } from '../../model/types/types';
import { FC, memo, ReactNode, useCallback } from 'react';
import styles from './todo-card.module.css';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/Icon/Icon';
import CircleIcon from '@/shared/assets/circle.svg';
import CircleCheckIcon from '@/shared/assets/circle-check.svg';
import { Chip } from '@/shared/ui/Chip/Chip';

interface TodoCardProps {
    todo: Todo;
    isCompleted?: boolean;
    renderActions: (todo: Todo, className: string) => ReactNode;
    onToggle: (todo: Todo) => void;
}

export const TodoCard: FC<TodoCardProps> = memo(
    ({ todo, isCompleted, renderActions, onToggle }) => {
        const handleToggleTodo = useCallback(
            (e?: React.MouseEvent) => {
                e?.stopPropagation();
                onToggle(todo);
            },
            [onToggle, todo]
        );

        return (
            <Card
                padding="4"
                fullWidth
                data-testid="todo-card"
                radius="xl"
                variant="filled"
                className={clsx(styles.todoCard, {
                    [styles.completed]: isCompleted,
                })}
                onClick={handleToggleTodo}
                lang="ru"
            >
                <HStack gap="8" align="start" className={styles.body}>
                    <Icon
                        aria-label={
                            todo.completed
                                ? 'Отметить как невыполненное'
                                : 'Отметить как выполненное'
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
                                    <Chip
                                        id={label.id}
                                        key={label.id}
                                        label={label.name}
                                        size="xs"
                                        style={style}
                                    />
                                );
                            })}
                        </HStack>
                        {todo.description && <Text text={todo.description} variant="secondary" />}
                    </VStack>
                    {renderActions(todo, styles.buttons)}
                </HStack>
            </Card>
        );
    }
);

TodoCard.displayName = 'TodoCard';
