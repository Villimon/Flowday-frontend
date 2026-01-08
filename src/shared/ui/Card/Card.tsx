import { HTMLAttributes, ReactNode } from 'react';
import cls from './Card.module.css';
import clsx from 'clsx';

export type CardVariant = 'elevated' | 'outline' | 'filled' | 'ghost';
export type CardPadding = '0' | '4' | '8' | '12' | '16' | '20' | '24';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: ReactNode;

    // Визуальные пропсы
    variant?: CardVariant;
    padding?: CardPadding;
    radius?: CardRadius;

    // Layout
    fullWidth?: boolean;
    fullHeight?: boolean;
    maxWidth?: string | number;

    // Accessibility
    role?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
}

const mapPaddingToClass: Record<CardPadding, string> = {
    '0': cls.padding0,
    '4': cls.padding4,
    '8': cls.padding8,
    '12': cls.padding12,
    '16': cls.padding16,
    '20': cls.padding20,
    '24': cls.padding24,
};

const mapRadiusToClass: Record<CardRadius, string> = {
    none: cls.radiusNone,
    sm: cls.radiusSm,
    md: cls.radiusMd,
    lg: cls.radiusLg,
    xl: cls.radiusXl,
    full: cls.radiusFull,
};

export const Card = ({
    className,
    children,
    variant = 'elevated',
    padding = '8',
    radius = 'md',
    fullWidth = false,
    fullHeight = false,
    maxWidth,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    style,
    ...otherProps
}: CardProps) => {
    const accessibilityProps = {
        ...(role && { role }),
        ...(ariaLabel && { 'aria-label': ariaLabel }),
        ...(ariaLabelledBy && { 'aria-labelledby': ariaLabelledBy }),
        ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
    };

    const inlineStyles = {
        ...style,
        ...(maxWidth && { maxWidth }),
    };

    return (
        <div
            className={clsx(
                cls.card,
                cls[variant],
                mapPaddingToClass[padding],
                mapRadiusToClass[radius],
                {
                    [cls.fullWidth]: fullWidth,
                    [cls.fullHeight]: fullHeight,
                },
                className
            )}
            style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
            {...accessibilityProps}
            {...otherProps}
        >
            {children}
        </div>
    );
};
