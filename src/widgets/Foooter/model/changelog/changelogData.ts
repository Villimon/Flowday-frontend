import { ChangeLogType } from '../types/types';

export const changeLog: ChangeLogType[] = [
    {
        id: '1',
        version: 'v1.0.0-beta',
        // TODO: поправить дату релиза
        dateRelese: '22.04.2026',
        description: 'Первая beta версия',
        isActuale: true,
        items: [
            {
                id: '1',
                status: 'new',
                description: 'Добавлен футер, в котором есть журнал изменений',
            },
            {
                id: '2',
                status: 'upgrade',
                description: 'Сделан редизайн хедера и главной страницы',
            },
            {
                id: '3',
                status: 'upgrade',
                description: 'Переделал карточки задач',
            },
        ],
    },
];
