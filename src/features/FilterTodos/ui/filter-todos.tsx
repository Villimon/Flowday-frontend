import { FC, memo } from 'react';
import { TodoStatus } from '../model/types/types';
import { TabItem, Tabs } from '@/shared/ui/Tabs/Tabs';
import { Card } from '@/shared/ui';
import styles from './filter-todos.module.css';
import CkeckIcon from '@/shared/assets/circle-check.svg';
import ListIcon from '@/shared/assets/list.svg';
import CalendarIcon from '@/shared/assets/calendar-card.svg';

const filterItems: TabItem[] = [
    { value: 'all', content: 'Все', Icon: ListIcon },
    { value: 'active', content: 'Активные', Icon: CalendarIcon },
    { value: 'completed', content: 'Выполненные', Icon: CkeckIcon },
];

interface FilterTodosProps {
    currentStatus: TodoStatus;
    onStatusChange: (newFilter: TabItem) => void;
}

export const FilterTodos: FC<FilterTodosProps> = memo(({ currentStatus, onStatusChange }) => {
    return (
        <Card variant="elevated" className={styles.card} radius="xl">
            <Tabs tabs={filterItems} onTabClick={onStatusChange} value={currentStatus} />
        </Card>
    );
});

FilterTodos.displayName = 'FilterTodos';
