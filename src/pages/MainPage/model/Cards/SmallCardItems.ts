// import CalendarIcon from '@/shared/assets/calendar-card.svg';
// import LayoutIcon from '@/shared/assets/layout.svg';
import SparkIcon from '@/shared/assets/spark.svg';
import ListIcon from '@/shared/assets/list.svg';

export const SMALL_CARD_ITEMS = [
    {
        id: '1',
        icon: SparkIcon,
        title: 'День',
        text: 'Подробные карточки задач, разделённые на три блока: запланированные по времени, без времени и наглядная сетка дня.',
        className: 'firstSmallCard',
    },
    // {
    //     id: '2',
    //     icon: CalendarIcon,
    //     title: 'Неделя',
    //     text: 'Семь колонок с компактными карточками всех задач.',
    //     className: 'secondSmallCard',
    // },
    // {
    //     id: '3',
    //     icon: LayoutIcon,
    //     title: 'Месяц',
    //     text: 'Полный месячный календарь с задачами на каждый день — удобен для обзора и долгосрочного планирования.',
    //     className: 'thirdSmallCard',
    // },
    {
        id: '4',
        icon: ListIcon,
        title: 'Список',
        text: 'Группы: просроченные, сегодня, неделя, предстоящие, без даты. Выполненные — отдельно.',
        className: 'fourthSmallCard',
    },
];
