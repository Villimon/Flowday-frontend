import {
    AriaAttributes,
    ComponentPropsWithRef,
    ElementType,
    memo,
    ReactNode,
    useCallback,
} from 'react';
import cls from './Buttons.module.css';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/Icon/Icon';

export type ButtonVariant = 'filled' | 'outline' | 'ghost' | 'clear' | 'glass';
export type ButtonColor = 'primary' | 'success' | 'error' | 'warning' | 'neutral';
export type IconColor =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'error'
    | 'warning'
    | 'current';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type AlignText = 'left' | 'center' | 'right';

export interface ButtonBaseProps {
    // Основные пропсы
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    radius?: ButtonRadius;
    alignText?: AlignText;

    // Состояния
    loading?: boolean;
    disabled?: boolean;

    // Layout
    fullWidth?: boolean;
    square?: boolean;
    iconOnly?: boolean;

    // Контент
    children?: ReactNode;
    addonLeft?: ReactNode;
    addonRight?: ReactNode;

    // Accessibility
    ariaLabel?: string; // самый важный для accessibility
    ariaLabelIcon?: string;
    ariaDescribedBy?: string; // дополнительное описание
    ariaControls?: string; // управление другими элементами
    ariaExpanded?: boolean; //  состояние раскрытия
    ariaPressed?: boolean; //  состояние нажатия (для toggle кнопок)
    ariaBusy?: boolean; //  состояние загрузки/обработки

    // Иконки
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    iconPosition?: 'left' | 'right';
    iconWidth?: number;
    iconHeight?: number;

    // Визуальные
    className?: string;
    iconClassName?: string;
    iconWrapperStyle?: string;
    iconColor?: IconColor;

    // Для compound компонентов (future-proof)
    asChild?: boolean;
}

export type ButtonProps<T extends ElementType> = ButtonBaseProps &
    Omit<ComponentPropsWithRef<T>, keyof ButtonBaseProps | 'as'> & {
        as?: T;
    };

export const Button = memo(<T extends ElementType = 'button'>(props: ButtonProps<T>) => {
    const {
        className,
        iconClassName,
        iconWrapperStyle,
        iconHeight = 18,
        iconWidth = 18,
        iconColor,
        children,
        variant = 'outline',
        square = false,
        disabled = false,
        loading = false,
        size = 'md',
        radius = 'md',
        fullWidth = false,
        addonLeft,
        addonRight,
        icon,
        iconPosition = 'left',
        iconOnly = false,
        color = 'primary',
        ariaLabel,
        ariaDescribedBy,
        ariaControls,
        ariaExpanded,
        ariaPressed,
        ariaLabelIcon,
        ariaBusy,
        type = 'button',
        as: Component = 'button',
        onKeyDown,
        onClick,
        alignText = 'center',
        ...otherProps
    } = props;

    // Обработка keyboard events для accessibility
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLButtonElement>) => {
            // Space или Enter активируют кнопку
            if (!disabled && !loading && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                if (onClick) {
                    onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
                }
            }

            if (onKeyDown) {
                onKeyDown(e);
            }
        },
        [disabled, loading, onClick, onKeyDown]
    );

    // Определяем content для рендера
    const renderContent = () => {
        if (iconOnly && icon) {
            return (
                <span className={clsx(cls.iconWrapper, iconWrapperStyle)} aria-hidden="true">
                    <Icon
                        color={iconColor}
                        Svg={icon}
                        className={iconClassName}
                        width={iconWidth}
                        height={iconHeight}
                        aria-label={ariaLabelIcon}
                    />
                </span>
            );
        }

        if (icon && !addonLeft && !addonRight) {
            const iconElement = (
                <span
                    className={clsx(cls.icon, iconWrapperStyle, cls[`icon-${iconPosition}`])}
                    aria-hidden="true"
                >
                    <Icon
                        color={iconColor}
                        Svg={icon}
                        width={iconWidth}
                        height={iconHeight}
                        className={iconClassName}
                        aria-label={ariaLabelIcon}
                    />
                </span>
            );

            return (
                <>
                    {iconPosition === 'left' && iconElement}
                    {children && <span className={cls.label}>{children}</span>}
                    {iconPosition === 'right' && iconElement}
                </>
            );
        }

        return (
            <>
                {addonLeft && (
                    <span className={clsx(cls.addon, cls.addonLeft)} aria-hidden="true">
                        {addonLeft}
                    </span>
                )}
                {children && <span className={cls.label}>{children}</span>}
                {addonRight && (
                    <span className={clsx(cls.addon, cls.addonRight)} aria-hidden="true">
                        {addonRight}
                    </span>
                )}
            </>
        );
    };

    // Собираем ARIA атрибуты
    const ariaAttributes: AriaAttributes = {
        'aria-label':
            ariaLabel || (iconOnly && typeof children === 'string' ? children : undefined),
        'aria-describedby': ariaDescribedBy,
        'aria-controls': ariaControls,
        'aria-expanded': ariaExpanded,
        'aria-pressed': ariaPressed,
        'aria-busy': loading || ariaBusy,
        'aria-disabled': disabled || loading,
    };

    // Очищаем undefined значения
    Object.keys(ariaAttributes).forEach(key => {
        if (ariaAttributes[key as keyof AriaAttributes] === undefined) {
            delete ariaAttributes[key as keyof AriaAttributes];
        }
    });

    return (
        <Component
            type={type}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            data-loading={loading}
            data-square={square}
            data-icon-only={iconOnly}
            className={clsx(
                cls.button,
                cls[`variant-${variant}`],
                cls[`color-${color}`],
                cls[`size-${size}`],
                cls[`radius-${radius}`],
                cls[`align-${alignText}`],
                {
                    [cls.square]: square,
                    [cls.disabled]: disabled,
                    [cls.loading]: loading,
                    [cls.fullWidth]: fullWidth,
                    [cls.iconOnly]: iconOnly,
                    [cls.withAddon]: Boolean(addonLeft) || Boolean(addonRight),
                    [cls.withIcon]: Boolean(icon),
                },
                className
            )}
            onKeyDown={handleKeyDown}
            onClick={onClick}
            {...ariaAttributes}
            {...otherProps}
        >
            {/* Loader для состояния загрузки */}
            {loading && (
                <span className={cls.loaderWrapper} aria-hidden="true">
                    <span className={cls.loader} />
                </span>
            )}

            {/* Основной контент */}
            <span
                className={clsx(cls.content, {
                    [cls.contentHidden]: loading,
                })}
            >
                {renderContent()}
            </span>
        </Component>
    );
});

Button.displayName = 'Button';
