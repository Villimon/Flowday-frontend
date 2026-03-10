import { Card, HStack, Text, VStack } from '@/shared/ui';
import { Todo } from '../../model/types/types';
import { FC } from 'react';
import { Icon } from '@/shared/ui/Icon/Icon';
import CircleSvg from '@/shared/assets/circle.svg';
import CircleCheckSvg from '@/shared/assets/circle-check.svg';
import styles from './todo-card.module.css';

interface TodoCardProps {
    todo: Todo;
}

export const TodoCard: FC<TodoCardProps> = ({ todo }) => {
    return (
        <Card padding="4" fullWidth>
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
