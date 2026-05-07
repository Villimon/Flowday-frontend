export const LABEL_KEYS = {
    all: ['labels'] as const,
    lists: () => [...LABEL_KEYS.all, 'list'] as const,
};
