import { FC, memo, useState, JSX } from 'react';
import styles from './TodoDayView.module.css';
import clsx from 'clsx';
import { Card, HStack, Text, VStack } from '@/shared/ui';
import { Todo, TodoDayData } from '@/entities/Todos/model/types/types';
import { TodoCard } from '@/entities/Todos/ui/TodoCard/todo-card';
import { Chip } from '@/shared/ui/Chip/Chip';
import { Icon } from '@/shared/ui/Icon/Icon';
import CalendarIcon from '@/shared/assets/calendar-card.svg';
import LayersIcon from '@/shared/assets/layers.svg';

type MobileTab = 'cards' | 'schedule';

interface TodoDayView {
    todos?: TodoDayData;
    renderActions: (todo: Todo, className: string) => JSX.Element;
    onToggle: (todo: Todo) => void;
    isAllTab: boolean;
}

export const TodoDayView: FC<TodoDayView> = memo(({ todos, renderActions, onToggle, isAllTab }) => {
    const [activeTab] = useState<MobileTab>('cards');

    return (
        <section className={styles.main}>
            {/* <div className={styles.mobileToggleWrapper}>
                <div className={styles.segmentedControl}>
                    <button
                        className={clsx(styles.toggleBtn, activeTab === 'cards' && styles.active)}
                        onClick={() => setActiveTab('cards')}
                    >
                        Карточки
                    </button>
                    <button
                        className={clsx(
                            styles.toggleBtn,
                            activeTab === 'schedule' && styles.active
                        )}
                        onClick={() => setActiveTab('schedule')}
                    >
                        График
                    </button>
                </div>
            </div> */}

            <div className={styles.layoutContainer}>
                <div className={clsx(activeTab === 'schedule' && styles.showMobile)}>
                    <Card fullWidth padding="4" className={clsx(styles.todoBlock)} radius="xl">
                        <VStack fullWidth gap="4">
                            <HStack fullWidth gap="4" align="center">
                                <Text text="ГРАФИК ДНЯ" size="xs" weight="bold" />
                                <Chip label={String(todos?.withDate.length)} />
                            </HStack>
                            {todos?.withDate.map(todo => (
                                <TodoCard
                                    key={todo.id}
                                    todo={todo}
                                    renderActions={renderActions}
                                    onToggle={onToggle}
                                    isCompleted={isAllTab && todo.completed}
                                />
                            ))}
                        </VStack>
                    </Card>
                </div>
                {(Boolean(todos?.withoutDate.length) || Boolean(todos?.withDate.length)) && (
                    <VStack
                        gap="8"
                        fullWidth
                        className={clsx(
                            styles.cardsColumn,
                            activeTab === 'cards' && styles.showMobile
                        )}
                    >
                        {Boolean(todos?.withoutDate.length) && (
                            <Card fullWidth padding="4" className={styles.todoBlock} radius="xl">
                                <VStack fullWidth gap="4">
                                    <HStack fullWidth gap="4" align="center">
                                        <Icon Svg={LayersIcon} width={16} height={16} />
                                        <Text text="БЕЗ ВРЕМЕНИ" size="xs" weight="bold" />
                                        <Chip label={String(todos?.withoutDate.length)} />
                                    </HStack>
                                    {todos?.withoutDate.map(todo => (
                                        <TodoCard
                                            key={todo.id}
                                            todo={todo}
                                            renderActions={renderActions}
                                            onToggle={onToggle}
                                            isCompleted={isAllTab && todo.completed}
                                            hasDate={false}
                                        />
                                    ))}
                                </VStack>
                            </Card>
                        )}
                        {Boolean(todos?.withDate.length) && (
                            <Card fullWidth padding="4" className={styles.todoBlock} radius="xl">
                                <VStack fullWidth gap="4">
                                    <HStack fullWidth gap="4" align="center">
                                        <Icon Svg={CalendarIcon} width={16} height={16} />
                                        <Text text="ПО РАСПИСАНИЮ" size="xs" weight="bold" />
                                        <Chip label={String(todos?.withDate.length)} />
                                    </HStack>
                                    {todos?.withDate.map(todo => (
                                        <TodoCard
                                            key={todo.id}
                                            todo={todo}
                                            renderActions={renderActions}
                                            onToggle={onToggle}
                                            isCompleted={isAllTab && todo.completed}
                                        />
                                    ))}
                                </VStack>
                            </Card>
                        )}
                    </VStack>
                )}
            </div>
        </section>
    );
});

TodoDayView.displayName = 'TodoDayView';
