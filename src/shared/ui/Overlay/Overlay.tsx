import { FC, memo } from 'react';
import cls from './Overlay.module.css';
import clsx from 'clsx';

interface OverlayProps {
    className?: string;
    onClick?: () => void;
    isVisible?: boolean;
    blur?: boolean;
}

export const Overlay: FC<OverlayProps> = memo(
    ({ className, onClick, isVisible = true, blur = false }) => {
        if (!isVisible) return null;

        return (
            <div
                role="presentation"
                aria-hidden="true"
                onClick={onClick}
                className={clsx(
                    cls.overlay,
                    {
                        [cls.blur]: blur,
                    },
                    className
                )}
            />
        );
    }
);

Overlay.displayName = 'Overlay';
