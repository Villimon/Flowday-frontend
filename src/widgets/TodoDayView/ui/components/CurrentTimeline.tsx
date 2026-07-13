import { FC, memo, useEffect, useState } from 'react';
import styles from './CurrentTimeline.module.css';

interface CurrentTimelineProps {
    startHour: number;
    endHour: number;
}

export const CurrentTimeline: FC<CurrentTimelineProps> = memo(({ endHour, startHour }) => {
    const [position, setPosition] = useState<number | null>(null);

    useEffect(() => {
        const calculatePosition = () => {
            const currentDate = new Date();
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();

            if (currentHour < startHour || currentHour > endHour) {
                setPosition(null);
                return;
            }

            const pixelStart = (currentHour - startHour) * 60 + currentMinute;
            setPosition(pixelStart);
        };

        calculatePosition();

        let timerId: NodeJS.Timeout;
        const startTimer = () => {
            const date = new Date();
            const delay = (60 - date.getSeconds()) * 1000;

            timerId = setTimeout(() => {
                calculatePosition();
                startTimer();
            }, delay);
        };

        startTimer();

        return () => clearTimeout(timerId);
    }, [startHour, endHour]);

    if (position === null) return null;

    return <div className={styles.currentTimeLine} style={{ top: `${position}px` }} />;
});

CurrentTimeline.displayName = 'CurrentTimeline';
