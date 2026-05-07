import { StatusColorMap, StatusIconMap, StatusLabelMap } from '../types/types';
import SparkIcon from '@/shared/assets/spark.svg';
import WrenchIcon from '@/shared/assets/wrench.svg';
import DebugIcon from '@/shared/assets/debug.svg';

export const mapStatusItemChangeLogToIcon: StatusIconMap = {
    correction: DebugIcon,
    new: SparkIcon,
    upgrade: WrenchIcon,
};

export const mapStatusItemChangeLogToColor: StatusColorMap = {
    correction: 'success',
    new: 'purple',
    upgrade: 'primary',
};

export const mapStatusItemChangeLogToLabel: StatusLabelMap = {
    correction: 'Исправление',
    new: 'Новое',
    upgrade: 'Улучшение',
};
