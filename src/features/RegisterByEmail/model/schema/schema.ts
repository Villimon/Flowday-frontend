import z from 'zod';

export const registerSchema = z.object({
    password: z.string().min(6, 'Пароль минимум 6 символов'),
    email: z.string().min(1, 'Поле обязательное').email('Неверный формат email'),
    name: z.string().min(2, 'Имя минимум 2 символа').max(50, 'Имя максимум 50 символов'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
