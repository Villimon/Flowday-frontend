import { Todo } from '@/entities/Todos';

export const sortTodosForClient = (todos: Todo[]) => {
    const active = todos.filter(t => !t.completed);
    const completed = todos.filter(t => t.completed);

    active.sort((a, b) => {
        if (!a.startDate && !b.startDate) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;

        const compareStart = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        if (compareStart !== 0) return compareStart;

        if (a.endDate && b.endDate) {
            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        }
        return 0;
    });

    completed.sort((a, b) => {
        const aDate = a.updatedAt || a.createdAt;
        const bDate = b.updatedAt || b.createdAt;

        return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

    return [...active, ...completed];
};
