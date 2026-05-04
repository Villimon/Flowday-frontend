import z from 'zod';

export const todoSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Название не может быть пустым')
        .max(200, 'Не более 200 символов'),
    description: z.string().trim().max(1000, 'Не более 1000 символов').optional(),
    labels: z.array(z.string()).default([]).optional(),
});

export type TodoFormData = z.infer<typeof todoSchema>;
