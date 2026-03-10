import { FC, memo } from 'react';
import { TodoFilter } from '../model/types/types';
import { TabItem, Tabs } from '@/shared/ui/Tabs/Tabs';

const filterItems: { value: TodoFilter; content: string }[] = [
    { value: 'all', content: 'Все задачи' },
    { value: 'active', content: 'Активные' },
    { value: 'completed', content: 'Выполненные' },
];

interface FilterTodosProps {
    currentFilter: TodoFilter;
    onFilterChange: (newFilter: TabItem) => void;
}

export const FilterTodos: FC<FilterTodosProps> = memo(({ currentFilter, onFilterChange }) => {
    return <Tabs tabs={filterItems} onTabClick={onFilterChange} value={currentFilter} />;
});
