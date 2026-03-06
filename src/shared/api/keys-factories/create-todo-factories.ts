export const TODO_KEYS = {
    all: ['todos'] as const,
    lists: () => [...TODO_KEYS.all, 'list'] as const,
    list: (filters?: string) => [...TODO_KEYS.lists(), filters] as const,
    details: () => [...TODO_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...TODO_KEYS.details(), id] as const,
};