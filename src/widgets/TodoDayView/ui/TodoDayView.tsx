import { FC, memo, useState, JSX, useMemo, useCallback } from 'react';
import styles from './TodoDayView.module.css';
import clsx from 'clsx';
import { Button, Card, HStack, Text, VStack } from '@/shared/ui';
import { Todo, TodoDayData } from '@/entities/Todos/model/types/types';
import { TodoCard } from '@/entities/Todos/ui/TodoCard/todo-card';
import { Chip } from '@/shared/ui/Chip/Chip';
import { Icon } from '@/shared/ui/Icon/Icon';
import CalendarIcon from '@/shared/assets/calendar-card.svg';
import LayersIcon from '@/shared/assets/layers.svg';
import { DayTimeline } from './components/DayTimeline';
import { useDayTimelineData } from '../model/hooks/useDayTimelineData';
import { TabItem, Tabs } from '@/shared/ui/Tabs/Tabs';
import ScheduleIcon from '@/shared/assets/calendar-card.svg';
import CardsIcon from '@/shared/assets/list.svg';
import { CreateTodo } from '@/features/CreateTodo';
import { addHours, format, setHours, setMinutes } from 'date-fns';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';

type MobileTab = 'cards' | 'schedule';

interface TodoDayView {
    todos?: TodoDayData;
    renderActions: (todo: Todo, className: string) => JSX.Element;
    onToggle: (todo: Todo) => void;
    isAllTab: boolean;
    currentDate: Date;
}

export const TodoDayView: FC<TodoDayView> = memo(
    ({ todos, renderActions, onToggle, isAllTab, currentDate }) => {
        const [activeTab, setActiveTab] = useState<MobileTab>('cards');
        const isMobile = useMedia('(max-width: 1024px)');

        const { totalHours, startHour, endHour, finalTodosToRender } = useDayTimelineData(todos);

        const handleChangeTab = useCallback((value: TabItem) => {
            setActiveTab(value.value as MobileTab);
        }, []);

        const filterItems: TabItem[] = useMemo(
            () => [
                { value: 'cards', content: 'Карточки', Icon: CardsIcon },
                { value: 'schedule', content: 'График', Icon: ScheduleIcon },
            ],
            []
        );

        const getDefaultTaskRange = useMemo(() => {
            const start = setMinutes(setHours(new Date(currentDate), 9), 0);
            const end = addHours(start, 1);

            return {
                startDate: format(start, 'dd.MM.yyyy HH:mm'),
                endDate: format(end, 'dd.MM.yyyy HH:mm'),
            };
        }, [currentDate]);

        return (
            <section className={styles.main}>
                <div className={styles.mobileToggleWrapper}>
                    <Card variant="elevated" className={styles.card} radius="xl">
                        <Tabs tabs={filterItems} onTabClick={handleChangeTab} value={activeTab} />
                    </Card>
                </div>

                <div className={styles.layoutContainer}>
                    <div
                        className={clsx(
                            styles.scheduleColumn,
                            activeTab === 'schedule' && styles.showMobile
                        )}
                    >
                        <DayTimeline
                            todosWithTime={finalTodosToRender}
                            totalBlock={totalHours}
                            startHour={startHour}
                            endHour={endHour}
                            currentDate={currentDate}
                        />
                    </div>
                    {Boolean(todos?.withoutDate.length) || Boolean(todos?.withDate.length) ? (
                        <VStack
                            gap="8"
                            fullWidth
                            className={clsx(
                                styles.cardsColumn,
                                activeTab === 'cards' && styles.showMobile
                            )}
                        >
                            {Boolean(todos?.withoutDate.length) && (
                                <Card
                                    fullWidth
                                    padding="4"
                                    className={styles.todoBlock}
                                    radius="xl"
                                >
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
                                <Card
                                    fullWidth
                                    padding="4"
                                    className={styles.todoBlock}
                                    radius="xl"
                                >
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
                    ) : (
                        <Card
                            radius="xl"
                            className={clsx(
                                styles.emptyBlock,
                                activeTab === 'cards' && styles.showMobile
                            )}
                        >
                            <VStack gap="8" fullWidth align="center">
                                <div className={styles.emptyIcon}>
                                    <Icon Svg={CalendarIcon} />
                                </div>
                                <VStack fullWidth align="center">
                                    <Text text="Свободный день" weight="bold" />
                                    <Text
                                        text={
                                            isMobile
                                                ? 'Нажмите «Добавить задачу» или кликните по времени на оси в блоке «График».'
                                                : 'Нажмите «Добавить задачу» или кликните по времени на оси сверху.'
                                        }
                                        size="xs"
                                        variant="secondary"
                                        align="center"
                                    />
                                </VStack>
                                <CreateTodo
                                    renderTrigger={openModal => (
                                        <Button radius="xl" size="sm" onClick={openModal}>
                                            Добавить задачу
                                        </Button>
                                    )}
                                    initialValues={getDefaultTaskRange}
                                />
                            </VStack>
                        </Card>
                    )}
                </div>
            </section>
        );
    }
);

TodoDayView.displayName = 'TodoDayView';
