import { Button, HStack, Text, VStack } from '@/shared/ui';
import { TodoCard } from '../../../entities/Todos/ui/TodoCard/todo-card';
import { FC, memo, useCallback, useState, JSX } from 'react';
import { Todo } from '@/entities/Todos';
import { TodoListData } from '@/entities/Todos/model/types/types';
import { Chip } from '@/shared/ui/Chip/Chip';

interface TodoListProps {
    todos?: TodoListData;
    renderActions: (todo: Todo, className: string) => JSX.Element;
    onToggle: (todo: Todo) => void;
    isAllTab: boolean;
}
type TodoListCategory = 'overdue' | 'today' | 'thisWeek' | 'upcoming' | 'withoutDate' | 'completed';

export const TodoList: FC<TodoListProps> = memo(({ todos, renderActions, onToggle, isAllTab }) => {
    const [expandedBlocks, setExpandedBlocks] = useState<Record<TodoListCategory, boolean>>({
        overdue: true,
        today: true,
        thisWeek: true,
        upcoming: true,
        withoutDate: true,
        completed: false,
    });

    const toggleBlockVisibility = useCallback((category: TodoListCategory) => {
        setExpandedBlocks(prev => ({ ...prev, [category]: !prev[category] }));
    }, []);

    return (
        <VStack gap="8" fullWidth as="section">
            {/* TODO: Вынести в компонент и на подумать оберуть в карточку */}
            {Boolean(todos?.overdue.length) && (
                <VStack gap="4" fullWidth>
                    <HStack fullWidth justify="between">
                        <HStack fullWidth gap="4" align="center">
                            <Text text="Просроченные" variant="error" weight="bold" />
                            <Chip label={String(todos?.overdue.length)} />
                        </HStack>
                        <Button onClick={() => toggleBlockVisibility('overdue')} variant="clear">
                            {expandedBlocks['overdue'] ? 'Скрыть' : 'Показать'}
                        </Button>
                    </HStack>
                    {expandedBlocks['overdue'] &&
                        todos?.overdue.map(todo => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                renderActions={renderActions}
                                onToggle={onToggle}
                            />
                        ))}
                </VStack>
            )}
            {Boolean(todos?.today.length) && (
                <VStack gap="4" fullWidth>
                    <HStack fullWidth justify="between">
                        <HStack fullWidth gap="4" align="center">
                            <Text text="Сегодня" variant="accent" weight="bold" />
                            <Chip label={String(todos?.today.length)} />
                        </HStack>
                        <Button onClick={() => toggleBlockVisibility('today')} variant="clear">
                            {expandedBlocks['today'] ? 'Скрыть' : 'Показать'}
                        </Button>
                    </HStack>
                    {expandedBlocks['today'] &&
                        todos?.today.map(todo => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                renderActions={renderActions}
                                onToggle={onToggle}
                            />
                        ))}
                </VStack>
            )}
            {Boolean(todos?.thisWeek.length) && (
                <VStack gap="4" fullWidth>
                    <HStack fullWidth justify="between">
                        <HStack fullWidth gap="4" align="center">
                            <Text text="На этой неделе" variant="warning" weight="bold" />
                            <Chip label={String(todos?.thisWeek.length)} />
                        </HStack>
                        <Button onClick={() => toggleBlockVisibility('thisWeek')} variant="clear">
                            {expandedBlocks['thisWeek'] ? 'Скрыть' : 'Показать'}
                        </Button>
                    </HStack>
                    {expandedBlocks['thisWeek'] &&
                        todos?.thisWeek.map(todo => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                renderActions={renderActions}
                                onToggle={onToggle}
                            />
                        ))}
                </VStack>
            )}
            {Boolean(todos?.upcoming.length) && (
                <VStack gap="4" fullWidth>
                    <HStack fullWidth justify="between">
                        <HStack fullWidth gap="4" align="center">
                            <Text text="Будущие" variant="success" weight="bold" />
                            <Chip label={String(todos?.upcoming.length)} />
                        </HStack>
                        <Button onClick={() => toggleBlockVisibility('upcoming')} variant="clear">
                            {expandedBlocks['upcoming'] ? 'Скрыть' : 'Показать'}
                        </Button>
                    </HStack>
                    {expandedBlocks['upcoming'] &&
                        todos?.upcoming.map(todo => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                renderActions={renderActions}
                                onToggle={onToggle}
                            />
                        ))}
                </VStack>
            )}
            {Boolean(todos?.withoutDate.length) && (
                <VStack gap="4" fullWidth>
                    <HStack fullWidth justify="between">
                        <HStack fullWidth gap="4" align="center">
                            <Text text="Без даты" variant="secondary" weight="bold" />
                            <Chip label={String(todos?.withoutDate.length)} />
                        </HStack>
                        <Button
                            onClick={() => toggleBlockVisibility('withoutDate')}
                            variant="clear"
                        >
                            {expandedBlocks['withoutDate'] ? 'Скрыть' : 'Показать'}
                        </Button>
                    </HStack>
                    {expandedBlocks['withoutDate'] &&
                        todos?.withoutDate.map(todo => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                renderActions={renderActions}
                                onToggle={onToggle}
                            />
                        ))}
                </VStack>
            )}
            {Boolean(todos?.completed.length) && (
                <VStack gap="4" fullWidth>
                    <HStack fullWidth justify="between">
                        <HStack fullWidth gap="4" align="center">
                            <Text text="Завершённые" variant="tertiary" weight="bold" />
                            <Chip label={String(todos?.completed.length)} />
                        </HStack>
                        <Button onClick={() => toggleBlockVisibility('completed')} variant="clear">
                            {expandedBlocks['completed'] ? 'Скрыть' : 'Показать'}
                        </Button>
                    </HStack>
                    {expandedBlocks['completed'] &&
                        todos?.completed.map(todo => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                isCompleted={isAllTab && todo.completed}
                                renderActions={renderActions}
                                onToggle={onToggle}
                            />
                        ))}
                </VStack>
            )}
        </VStack>
    );
});

TodoList.displayName = 'TodoList';
