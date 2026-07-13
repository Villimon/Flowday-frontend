import { Button, Card, Text, VStack } from '@/shared/ui';
import { FC, memo } from 'react';
import styles from './DayTimeline.module.css';
import clsx from 'clsx';
import { CurrentTimeline } from './CurrentTimeline';
import { CreateTodo } from '@/features/CreateTodo';
import { addHours, format, isToday } from 'date-fns';
import { EditTodo } from '@/features/EditTodo';
import { PositionedTodo } from '../../model/types/types';
import { formatTooltipTime } from '../../lib/formatTooltipTime';

interface DayTimelineProps {
    totalBlock: number;
    startHour: number;
    endHour: number;
    todosWithTime?: PositionedTodo[];
    currentDate: Date;
}

export const DayTimeline: FC<DayTimelineProps> = memo(
    ({ endHour, startHour, totalBlock, todosWithTime, currentDate }) => {
        const hoursRange = Array.from({ length: totalBlock }, (_, index) => startHour + index);

        const showTimeline = isToday(currentDate);

        return (
            <Card fullWidth padding="0" radius="xl" className={styles.timelineWrapper}>
                <VStack fullWidth gap="4">
                    <Text text="ГРАФИК ДНЯ" size="xs" weight="bold" className={styles.title} />
                    <div className={styles.gridContainer}>
                        <VStack fullWidth>
                            {hoursRange.map(hour => {
                                const formattedTime = `${String(hour).padStart(2, '0')}:00`;
                                const [hours, minutes] = formattedTime.split(':');

                                const startDateObj = new Date(currentDate);
                                startDateObj.setHours(Number(hours), Number(minutes), 0, 0);

                                const endDateObj = addHours(startDateObj, 1);

                                const formattedStartDate = format(startDateObj, 'dd.MM.yyyy HH:mm');
                                const formattedEndDate = format(endDateObj, 'dd.MM.yyyy HH:mm');
                                return (
                                    <div key={hour} className={styles.timeBlock}>
                                        <Text
                                            text={formattedTime}
                                            className={styles.time}
                                            size="xs"
                                        />
                                        <CreateTodo
                                            className={styles.createButton}
                                            initialValues={{
                                                startDate: formattedStartDate,
                                                endDate: formattedEndDate,
                                            }}
                                            renderTrigger={openModal => (
                                                <Button
                                                    radius="none"
                                                    variant="clear"
                                                    onClick={openModal}
                                                    className={styles.button}
                                                >
                                                    +
                                                </Button>
                                            )}
                                        />
                                    </div>
                                );
                            })}
                        </VStack>
                        <div className={styles.tasksContainer}>
                            {todosWithTime?.map(todo => {
                                const color = todo.labels?.[0]?.color ?? '#3b82f6';

                                const timeStart = formatTooltipTime(todo.startDate);
                                const timeEnd = formatTooltipTime(todo.endDate);
                                const timeInterval =
                                    timeStart && timeEnd
                                        ? `\nВремя: ${timeStart} — ${timeEnd}`
                                        : '';
                                const tooltipText = `Задача: ${todo.title}${timeInterval}`;

                                const customStyle = {
                                    backgroundColor: `color-mix(in srgb, ${color}, transparent 60%)`,
                                    top: `${todo.top}px`,
                                    height: `${todo.height}px`,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: color,
                                    position: 'absolute' as const,
                                    left: `${todo.leftPercent}%`,
                                    width: `${todo.widthPercent}%`,
                                    opacity: todo.completed ? 0.4 : 1,
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    color: color,
                                };

                                return (
                                    <EditTodo
                                        key={todo.id}
                                        todo={todo}
                                        renderTrigger={openModal => (
                                            <div
                                                key={todo.id}
                                                className={clsx(styles.taskCard)}
                                                style={customStyle}
                                                title={tooltipText}
                                                onClick={openModal}
                                            >
                                                {todo.title}
                                            </div>
                                        )}
                                    />
                                );
                            })}
                        </div>
                        {showTimeline && (
                            <CurrentTimeline endHour={endHour} startHour={startHour} />
                        )}
                    </div>
                </VStack>
            </Card>
        );
    }
);

DayTimeline.displayName = 'DayTimeline';
