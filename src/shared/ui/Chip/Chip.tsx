import { FC, HTMLAttributes, memo } from 'react';
import cls from './Chip.module.css';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/Icon/Icon';

export type ChipVariant = 'filled' | 'outline' | 'ghost' | 'clear';
export type ChipColor =
    | 'primary'
    | 'success'
    | 'error'
    | 'warning'
    | 'neutral'
    | 'purple'
    | 'cyan'
    | 'pink';
export type ChipSize = 'xs' | 'sm' | 'md' | 'lg';
export type ChipRadius = 'sm' | 'md' | 'lg' | 'full';

export interface ChipProps extends HTMLAttributes<HTMLDivElement | HTMLButtonElement> {
    // Основные
    variant?: ChipVariant;
    color?: ChipColor;
    size?: ChipSize;
    radius?: ChipRadius;
    isUpperCase?: boolean;

    // Контент
    label: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    iconPosition?: 'left' | 'right';

    // Состояния
    clickable?: boolean;
    disabled?: boolean;
    removable?: boolean;
    onRemove?: () => void;

    // Стили
    className?: string;
    iconClassName?: string;
    iconColor?: 'primary' | 'success' | 'error' | 'warning' | 'current';
    iconHeight?: number;
    iconWidth?: number;

    // Accessibility
    ariaLabel?: string;
}

export const Chip: FC<ChipProps> = memo(
    ({
        label,
        icon,
        iconPosition = 'left',
        variant = 'outline',
        color = 'neutral',
        size = 'xs',
        radius = 'full',
        clickable = false,
        disabled = false,
        removable = false,
        onRemove,
        className,
        iconClassName,
        iconColor = 'current',
        iconHeight = '12',
        iconWidth = '12',
        ariaLabel,
        isUpperCase = false,
        onClick,
        ...otherProps
    }) => {
        const isClickable = clickable && !disabled;
        const Component = isClickable ? 'button' : 'div';

        const handleRemove = (e: React.MouseEvent) => {
            e.stopPropagation();
            onRemove?.();
        };

        return (
            <Component
                className={clsx(
                    cls.chip,
                    cls[`variant-${variant}`],
                    cls[`color-${color}`],
                    cls[`size-${size}`],
                    cls[`radius-${radius}`],
                    {
                        [cls.clickable]: isClickable,
                        [cls.disabled]: disabled,
                    },
                    className
                )}
                onClick={isClickable ? onClick : undefined}
                disabled={disabled}
                aria-label={ariaLabel || label}
                aria-disabled={disabled}
                {...otherProps}
            >
                {icon && iconPosition === 'left' && (
                    <Icon
                        Svg={icon}
                        width={iconWidth}
                        height={iconHeight}
                        color={iconColor}
                        className={clsx(cls.icon, iconClassName)}
                    />
                )}
                <span className={cls.label}>{isUpperCase ? label.toLocaleUpperCase() : label}</span>
                {icon && iconPosition === 'right' && (
                    <Icon
                        Svg={icon}
                        width={iconWidth}
                        height={iconHeight}
                        color={iconColor}
                        className={clsx(cls.icon, iconClassName)}
                    />
                )}
                {removable && (
                    <button
                        type="button"
                        className={cls.remove}
                        onClick={handleRemove}
                        aria-label={`Удалить ${label}`}
                    >
                        ×
                    </button>
                )}
            </Component>
        );
    }
);

Chip.displayName = 'Chip';
