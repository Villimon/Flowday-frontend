import { Card, HStack, Text, VStack } from '@/shared/ui';
import { Todo } from '../../model/types/types';
import { FC } from 'react';
import { Icon } from '@/shared/ui/Icon/Icon';
import CircleSvg from '@/shared/assets/circle.svg';
import CircleCheckSvg from '@/shared/assets/circle-check.svg';
import styles from './todo-card.module.css';
import clsx from 'clsx';

interface TodoCardProps {
    todo: Todo;
    filter: string;
}

export const TodoCard: FC<TodoCardProps> = ({ todo, filter }) => {
    return (
        <Card
            padding="4"
            fullWidth
            className={clsx(styles.todoCard, {
                [styles.completed]: todo.completed && filter === 'all',
            })}
        >
            <HStack gap="8">
                <Icon
                    clickable
                    onClick={() => {}}
                    aria-label="checbox"
                    Svg={todo.completed ? CircleCheckSvg : CircleSvg}
                />
                <VStack fullWidth gap="2">
                    <Text title={todo.title} size="2xl" />
                    {todo.description && <Text text={todo.description} />}
                </VStack>
            </HStack>
        </Card>
    );
};
