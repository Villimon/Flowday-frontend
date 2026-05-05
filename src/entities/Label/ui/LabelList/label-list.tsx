import { HStack } from '@/shared/ui';
import { Label } from '../../model/types/types';
import { FC, useCallback } from 'react';
import { Chip } from '@/shared/ui/Chip/Chip';
import { useDeleteLabel } from '@/features/DeleteLabel';

interface TodoListProps {
    labels?: Label[];
    activeLabels?: string[];
    onChange: (id: string) => void;
}

export const LabelList: FC<TodoListProps> = ({ labels = [], activeLabels = [], onChange }) => {
    const { mutate: deleteLabelMutate } = useDeleteLabel();

    const handleDeleteLabel = useCallback(
        (labelId: string, e?: React.MouseEvent) => {
            e?.stopPropagation();
            deleteLabelMutate(labelId);
        },
        [deleteLabelMutate]
    );

    const initialLabel: Label = {
        id: '',
        color: '#94a3b8',
        name: 'Без метки',
    };

    return (
        <HStack gap="2" fullWidth wrap="wrap">
            {[initialLabel, ...labels]?.map(label => {
                const active = activeLabels.length
                    ? activeLabels.includes(label.id)
                    : label.id === '';

                const customStyle = active
                    ? {
                          backgroundColor: `color-mix(in srgb, ${label.color}, transparent 80%)`,
                          color: label.color,
                          borderColor: label.color,
                      }
                    : {};

                return (
                    <Chip
                        data-testid={`label-option-${label.name}`}
                        key={label.id}
                        label={label.name}
                        clickable
                        size="md"
                        isActive={active}
                        style={customStyle}
                        onClick={() => onChange(label.id)}
                        removable={label.id !== ''}
                        onRemove={() => handleDeleteLabel(label.id)}
                    />
                );
            })}
        </HStack>
    );
};
