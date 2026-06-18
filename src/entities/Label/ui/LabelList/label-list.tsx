import { HStack } from '@/shared/ui';
import { Label } from '../../model/types/types';
import { FC, memo, useCallback, useMemo } from 'react';
import { Chip } from '@/shared/ui/Chip/Chip';

interface TodoListProps {
    labels?: Label[];
    activeLabels?: string[];
    onChange: (id: string) => void;
    onRemove: (id: string) => void;
}

const INITIAL_LABEL: Label = {
    id: '',
    color: '#94a3b8',
    name: 'Без метки',
};

export const LabelList: FC<TodoListProps> = memo(
    ({ labels = [], activeLabels = [], onChange, onRemove }) => {
        const handleDeleteLabel = useCallback(
            (labelId: string, e?: React.MouseEvent) => {
                e?.stopPropagation();
                onRemove(labelId);
            },
            [onRemove]
        );

        const allLabels = useMemo(() => [INITIAL_LABEL, ...labels], [labels]);

        return (
            <HStack gap="2" fullWidth wrap="wrap">
                {allLabels.map(label => {
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
                            id={label.id}
                            label={label.name}
                            clickable
                            size="md"
                            isActive={active}
                            style={customStyle}
                            onClick={() => onChange(label.id)}
                            removable={label.id !== ''}
                            onRemove={handleDeleteLabel}
                        />
                    );
                })}
            </HStack>
        );
    }
);

LabelList.displayName = 'LabelList';
