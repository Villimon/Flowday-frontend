import { ChipColor } from '@/shared/ui/Chip/Chip';
import { FC, SVGProps } from 'react';

export type ChangelogStatus = 'new' | 'upgrade' | 'correction';

export interface ChangeLogItemType {
    id: string;
    status: ChangelogStatus;
    description: string;
}

export interface ChangeLogType {
    id: string;
    version: string;
    dateRelese: string;
    description?: string;
    isActuale: boolean;
    items: ChangeLogItemType[];
}

export type StatusIconMap = Record<ChangelogStatus, FC<SVGProps<SVGSVGElement>>>;
export type StatusColorMap = Record<ChangelogStatus, ChipColor>;
export type StatusLabelMap = Record<ChangelogStatus, string>;
