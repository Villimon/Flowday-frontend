import { TodoView } from '@/entities/Todos/model/types/types';
import { Card } from '@/shared/ui';
import { TabItem, Tabs } from '@/shared/ui/Tabs/Tabs';
import { FC, memo, useMemo } from 'react';
import styles from './filter-todos-view.module.css';

interface FilterTodosViewProps {
    currentView: TodoView;
    onViewChange: (newView: TabItem) => void;
}

export const FilterTodosView: FC<FilterTodosViewProps> = memo(({ currentView, onViewChange }) => {
    const viewItems: TabItem[] = useMemo(
        () => [
            { value: 'day', content: 'День' },
            { value: 'list', content: 'Список' },
        ],
        []
    );

    return (
        <Card variant="elevated" className={styles.card} radius="xl">
            <Tabs size="sm" tabs={viewItems} onTabClick={onViewChange} value={currentView} />
        </Card>
    );
});

FilterTodosView.displayName = 'FilterTodosView';
