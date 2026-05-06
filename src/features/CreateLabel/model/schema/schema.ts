import z from 'zod';
// TODO: для уменьшения бандла посмотреть на valibot

export const labelSchema = z.object({
    name: z.string().trim().min(1, 'Название не может быть пустым').max(30, 'Не более 30 символов'),
});

export type LabelFormData = z.infer<typeof labelSchema>;
