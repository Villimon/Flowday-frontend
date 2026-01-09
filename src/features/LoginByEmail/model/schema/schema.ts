import z from 'zod';

export const loginSchema = z.object({
    password: z.string().min(6, 'Пароль минимум 6 символов'),
    email: z.string().min(1, 'Поле обязательное').email('Неверный формат email'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
