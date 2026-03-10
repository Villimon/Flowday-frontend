import { FC, memo } from 'react';
import { TodoStatus } from '../model/types/types';
import { TabItem, Tabs } from '@/shared/ui/Tabs/Tabs';

const filterItems: { value: TodoStatus; content: string }[] = [
    { value: 'all', content: 'Все задачи' },
    { value: 'active', content: 'Активные' },
    { value: 'completed', content: 'Выполненные' },
];

interface FilterTodosProps {
    currentStatus: TodoStatus;
    onStatusChange: (newFilter: TabItem) => void;
}

export const FilterTodos: FC<FilterTodosProps> = memo(({ currentStatus, onStatusChange }) => {
    return <Tabs tabs={filterItems} onTabClick={onStatusChange} value={currentStatus} />;
});
