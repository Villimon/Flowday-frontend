import { FC, memo, useMemo } from 'react';
import { TodoStatus } from '../model/types/types';
import { TabItem, Tabs } from '@/shared/ui/Tabs/Tabs';
import { Card } from '@/shared/ui';
import styles from './filter-todos.module.css';
import CkeckIcon from '@/shared/assets/circle-check.svg';
import ListIcon from '@/shared/assets/list.svg';
import CalendarIcon from '@/shared/assets/calendar-card.svg';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';

interface CountsType {
    all: number;
    active: number;
    completed: number;
}

interface FilterTodosProps {
    currentStatus: TodoStatus;
    onStatusChange: (newFilter: TabItem) => void;
    counts?: CountsType;
}

export const FilterTodos: FC<FilterTodosProps> = memo(
    ({ currentStatus, onStatusChange, counts }) => {
        const isMobile = useMedia('(max-width: 400px)');

        const filterItems: TabItem[] = useMemo(
            () => [
                { value: 'all', content: 'Все', Icon: ListIcon, count: counts?.all },
                { value: 'active', content: 'Активные', Icon: CalendarIcon, count: counts?.active },
                {
                    value: 'completed',
                    content: 'Выполненные',
                    Icon: CkeckIcon,
                    count: counts?.completed,
                },
            ],
            [counts]
        );

        return (
            <Card variant="elevated" className={styles.card} radius="xl">
                <Tabs
                    iconOnlyOnMobile={isMobile}
                    tabs={filterItems}
                    onTabClick={onStatusChange}
                    value={currentStatus}
                />
            </Card>
        );
    }
);

FilterTodos.displayName = 'FilterTodos';
