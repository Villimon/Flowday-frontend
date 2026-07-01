import { FC, memo } from 'react';
import ArrowNextIcon from '@/shared/assets/arrow-next.svg';
import ArrowPrevIcon from '@/shared/assets/arrow-prev.svg';
import { Button, HStack } from '@/shared/ui';

interface DateNavigatorProps {
    handleResetToToday: () => void;
    handlePrevDate: () => void;
    handleNextDate: () => void;
}

export const DateNavigator: FC<DateNavigatorProps> = memo(
    ({ handleNextDate, handlePrevDate, handleResetToToday }) => {
        return (
            <HStack gap="2">
                <Button
                    onClick={handlePrevDate}
                    size="sm"
                    radius="xl"
                    iconOnly
                    icon={ArrowPrevIcon}
                />
                <Button onClick={handleResetToToday} size="sm" radius="xl">
                    Сегодня
                </Button>
                <Button
                    onClick={handleNextDate}
                    size="sm"
                    radius="xl"
                    iconOnly
                    icon={ArrowNextIcon}
                />
            </HStack>
        );
    }
);

DateNavigator.displayName = 'DateNavigator';
