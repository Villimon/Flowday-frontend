import { ChangeLogType } from '../types/types';

export const changeLog: ChangeLogType[] = [
    {
        id: '1',
        version: 'v1.0.0-beta-1',
        // TODO: поправить дату релиза
        dateRelese: '22.04.2026',
        description: 'Первая beta версия',
        isActuale: true,
        items: [
            {
                id: '1',
                status: 'new',
                description:
                    'Добавлен футер с разделом "Журнал изменений" для отслеживания обновлений',
            },
            {
                id: '2',
                status: 'upgrade',
                description: 'Полностью обновлён дизайн шапки сайта и главной страницы',
            },
            {
                id: '3',
                status: 'upgrade',
                description: 'Переработан дизайн карточек задач и блока фильтрации',
            },
            {
                id: '4',
                status: 'new',
                description: 'Добавлены иконки для фильтров и кнопки "Новая задача"',
            },
            {
                id: '5',
                status: 'upgrade',
                description:
                    'Обновлён визуальный стиль верхней панели (блок с фильтрами) на странице с задачами',
            },
        ],
    },
];
