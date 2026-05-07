import CalendarIcon from '@/shared/assets/calendar-card.svg';
import LayoutIcon from '@/shared/assets/layout.svg';
import SparkIcon from '@/shared/assets/spark.svg';
import ListIcon from '@/shared/assets/list.svg';

export const SMALL_CARD_ITEMS = [
    {
        id: '1',
        icon: SparkIcon,
        title: 'День',
        text: 'Фокус на одном дне с подробными карточками задач',
        className: 'firstSmallCard',
    },
    {
        id: '2',
        icon: CalendarIcon,
        title: 'Неделя',
        text: 'Семь колонок с компактными карточками всех задач',
        className: 'secondSmallCard',
    },
    {
        id: '3',
        icon: LayoutIcon,
        title: 'Месяц',
        text: 'Полный календарь и адаптивная повестка для мобильных',
        className: 'thirdSmallCard',
    },
    {
        id: '4',
        icon: ListIcon,
        title: 'Список',
        text: 'Все задачи без привязки к датам, сгруппированы по срокам',
        className: 'fourthSmallCard',
    },
];
