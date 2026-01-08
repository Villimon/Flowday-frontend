import { ReactNode, HTMLAttributes, ElementType } from 'react';
import cls from './Flex.module.css';
import clsx from 'clsx';

export type FlexJustify = 'start' | 'center' | 'end' | 'between';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch';
export type FlexDirection = 'row' | 'column';
export type FlexGap = '2' | '4' | '8' | '12' | '16' | '24' | '32';
export type FlexWrap = 'nowrap' | 'wrap';

export interface FlexProps extends HTMLAttributes<HTMLElement> {
    className?: string;
    children: ReactNode;

    // Layout props
    justify?: FlexJustify;
    align?: FlexAlign;
    direction?: FlexDirection;
    gap?: FlexGap;
    wrap?: FlexWrap;

    // Sizing
    fullWidth?: boolean;

    // Semantic element
    as?: ElementType;

    // Accessibility
    role?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

const justifyClasses: Record<FlexJustify, string> = {
    start: cls.justifyStart,
    center: cls.justifyCenter,
    end: cls.justifyEnd,
    between: cls.justifyBetween,
};

const alignClasses: Record<FlexAlign, string> = {
    start: cls.alignStart,
    center: cls.alignCenter,
    end: cls.alignEnd,
    stretch: cls.alignStretch,
};

const directionClasses: Record<FlexDirection, string> = {
    row: cls.directionRow,
    column: cls.directionColumn,
};

const gapClasses: Record<FlexGap, string> = {
    '2': cls.gap2,
    '4': cls.gap4,
    '8': cls.gap8,
    '12': cls.gap12,
    '16': cls.gap16,
    '24': cls.gap24,
    '32': cls.gap32,
};

const wrapClasses: Record<FlexWrap, string> = {
    nowrap: cls.nowrap,
    wrap: cls.wrap,
};

export const Flex = ({
    className,
    children,
    justify = 'start',
    align = 'stretch',
    direction = 'row',
    gap,
    wrap = 'nowrap',
    fullWidth = false,
    as: Component = 'div',
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...otherProps
}: FlexProps) => {
    const classes = [
        cls.flex,
        justifyClasses[justify],
        alignClasses[align],
        directionClasses[direction],
        wrapClasses[wrap],
        gap && gapClasses[gap],
        fullWidth && cls.fullWidth,
        className,
    ];

    const accessibilityProps = {
        ...(role && { role }),
        ...(ariaLabel && { 'aria-label': ariaLabel }),
        ...(ariaLabelledBy && { 'aria-labelledby': ariaLabelledBy }),
    };

    return (
        <Component className={clsx(classes)} {...accessibilityProps} {...otherProps}>
            {children}
        </Component>
    );
};
