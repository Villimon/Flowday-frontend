import { Card, HStack, Text, VStack } from '@/shared/ui';
import { Todo } from '../../model/types/types';
import { FC } from 'react';
import { Icon } from '@/shared/ui/Icon/Icon';
import CircleIcon from '@/shared/assets/circle.svg';
import CircleCheckIcon from '@/shared/assets/circle-check.svg';
import styles from './todo-card.module.css';
import clsx from 'clsx';
import { DeleteTodo } from '@/features/DeleteTodo';
import EditIcon from '@/shared/assets/edit-pen.svg';

interface TodoCardProps {
    todo: Todo;
    status: string;
}

export const TodoCard: FC<TodoCardProps> = ({ todo, status }) => {
    return (
        <Card
            padding="4"
            fullWidth
            className={clsx(styles.todoCard, {
                [styles.completed]: todo.completed && status === 'all',
            })}
        >
            <HStack gap="8">
                <Icon
                    clickable
                    onClick={() => {}}
                    aria-label="checbox"
                    Svg={todo.completed ? CircleCheckIcon : CircleIcon}
                    color="primary"
                />
                <VStack fullWidth gap="2">
                    <Text title={todo.title} size="2xl" />
                    {todo.description && <Text text={todo.description} />}
                </VStack>
                <HStack gap="2" className={styles.buttons}>
                    <Icon
                        clickable
                        onClick={() => {}}
                        aria-label="edit"
                        Svg={EditIcon}
                        color="secondary"
                    />
                    <DeleteTodo todoId={todo.id} />
                </HStack>
            </HStack>
        </Card>
    );
};
