import z from 'zod';

// Регулярное выражение для форматов:
// 1. "ДД.ММ.ГГГГ ЧЧ:ММ" (с временем)
// 2. "ДД.ММ.ГГГГ" (только дата)
const dateTimeRegex =
    /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}(?:\s(?:[01]\d|2[0-3]):[0-5]\d)?$/;

const dateFieldSchema = z
    .string()
    .regex(dateTimeRegex, 'Неверный формат даты. Ожидается ДД.ММ.ГГГГ ЧЧ:ММ или ДД.ММ.ГГГГ')
    .optional()
    .or(z.literal('').transform(() => undefined));

export const todoSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, 'Название не может быть пустым')
            .max(200, 'Не более 200 символов'),
        description: z.string().trim().max(1000, 'Не более 1000 символов').optional(),
        labels: z.array(z.string()).default([]).optional(),
        startDate: dateFieldSchema,
        endDate: dateFieldSchema,
    })
    .superRefine((data, ctx) => {
        if (data.startDate && data.endDate) {
            const parseDate = (str: string) => {
                const [datePart, timePart] = str.split(' ');
                const [day, month, year] = datePart.split('.').map(Number);
                const [hours, minutes] = timePart ? timePart.split(':').map(Number) : [0, 0];
                return new Date(year, month - 1, day, hours, minutes);
            };

            const start = parseDate(data.startDate);
            const end = parseDate(data.endDate);

            if (end < start) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Дата окончания не может быть раньше даты начала',
                    path: ['endDate'],
                });
            }
        }
    });

export type TodoFormData = z.infer<typeof todoSchema>;
