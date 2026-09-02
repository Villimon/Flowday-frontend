import { memo, useCallback, useState } from 'react';
import styles from './todos-page.module.css';
import { CreateTodo } from '@/features/CreateTodo';
import { Card, HStack, Text, VStack } from '@/shared/ui';
import { FilterTodos } from '@/features/FilterTodos';
import { useTodos } from '@/entities/Todos/api/use-todo';
import { TabItem } from '@/shared/ui/Tabs/Tabs';
import clsx from 'clsx';
import { TodoList } from '@/widgets/TodoListView';
import { TodoStatus } from '@/entities/Todos';
import { FilterTodosView } from '@/features/FilterTodosView';
import { Todo, TodoDayData, TodoListData, TodoView } from '@/entities/Todos/model/types/types';
import { DateNavigator } from '@/features/DateNavigator';
import { addDays, subDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Loader } from '@/shared/ui/Loader/Loader';
import { TodoDayView } from '@/widgets/TodoDayView';
import { EditTodo } from '@/features/EditTodo';
import { DeleteTodo } from '@/features/DeleteTodo';
import { useToggleTodo } from '@/features/ToggleTodo';
import { toast } from 'react-toastify';
import { RemoveCompletedTodos } from '@/features/RemoveCompletedTodos';

// TODO: Если захочу чтобы состояние сохранялось перейти на Стейт в URL-квери параметрах (?view=week&status=active), а внутри фич брать все из роута (url)
// Либо сделать контекст для страницы
const TodosPage = memo(() => {
    const [status, setStatus] = useState<TodoStatus>('all');
    const [view, setView] = useState<TodoView>('day');
    const [currentDate, setCurrentDate] = useState(new Date());

    const isDayView = view === 'day';
    const isAllTab = status === 'all';

    const { mutate: toggleTodoMutate } = useToggleTodo();
    const { data, isLoading, isError } = useTodos({ status, view, currentDate });

    const [lastCounts, setLastCounts] = useState(data?.counts);

    if (data?.counts && data.counts !== lastCounts) {
        setLastCounts(data.counts);
    }

    const handleToggleTodo = useCallback(
        (todo: Todo) => {
            toggleTodoMutate(todo, {
                onError: error => {
                    toast.error(error.message || 'Ошибка при изменении статуса');
                },
            });
        },
        [toggleTodoMutate]
    );

    const handleStatusChange = useCallback((newStatus: TabItem) => {
        setStatus(newStatus.value as TodoStatus);
    }, []);

    const handleViewChange = useCallback((newView: TabItem) => {
        setView(newView.value as TodoView);
    }, []);

    const handleResetToToday = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    const handlePrevDate = useCallback(() => {
        setCurrentDate(prev => subDays(prev, 1));
    }, []);

    const handleNextDate = useCallback(() => {
        setCurrentDate(prev => addDays(prev, 1));
    }, []);

    const getTodoHeaderTitle = (): string => {
        if (view === 'day') {
            const dateObj = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;

            // Форматирует в вид "1 Июля 2026 г."
            return format(dateObj, 'd MMMM yyyy г.', { locale: ru });
        }

        return 'Все Задачи';
    };

    const renderActions = useCallback((todo: Todo, className: string) => {
        return (
            <Card className={className} radius="xl">
                <HStack justify="center" align="center" onClick={e => e.stopPropagation()} gap="2">
                    <EditTodo todo={todo} />
                    <DeleteTodo todoId={todo.id} />
                </HStack>
            </Card>
        );
    }, []);

    const renderTodoContent = () => {
        if (isLoading) {
            return <Loader />;
        }

        if (isError || !data || !data.todos) {
            return <Text text="Не удалось получить список задач " />;
        }

        const todosData = data.todos;

        switch (view) {
            case 'list':
                return (
                    <TodoList
                        renderActions={renderActions}
                        todos={todosData as TodoListData}
                        onToggle={handleToggleTodo}
                        isAllTab={isAllTab}
                    />
                );
            case 'day':
                return (
                    <TodoDayView
                        renderActions={renderActions}
                        todos={todosData as TodoDayData}
                        onToggle={handleToggleTodo}
                        isAllTab={isAllTab}
                        currentDate={currentDate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <main className={clsx(styles.main)}>
            <VStack fullWidth className={clsx(styles.wrapper)}>
                <div className={styles.filterSection}>
                    <VStack className={'container'} gap="2" fullWidth>
                        <HStack fullWidth wrap="wrap" gap="4" align="center" justify="between">
                            <FilterTodosView currentView={view} onViewChange={handleViewChange} />
                            {isDayView && (
                                <DateNavigator
                                    handleResetToToday={handleResetToToday}
                                    handlePrevDate={handlePrevDate}
                                    handleNextDate={handleNextDate}
                                />
                            )}
                            <Text text={getTodoHeaderTitle()} weight="bold" />
                        </HStack>
                        <HStack fullWidth wrap="wrap" gap="4" align="center" justify="end">
                            {status === 'completed' && (
                                <RemoveCompletedTodos
                                    date={currentDate}
                                    status={status}
                                    view={view}
                                    title={
                                        isDayView
                                            ? 'Очистить выполненные за день'
                                            : 'Очистить все выполненные'
                                    }
                                />
                            )}
                            <FilterTodos
                                currentStatus={status}
                                onStatusChange={handleStatusChange}
                                counts={data?.counts ?? lastCounts}
                            />
                            <CreateTodo />
                        </HStack>
                    </VStack>
                </div>
                <div className={clsx(styles.todoSection, 'container', isLoading && styles.loading)}>
                    {renderTodoContent()}
                </div>
            </VStack>
        </main>
    );
});

export default TodosPage;

TodosPage.displayName = 'TodosPage';
