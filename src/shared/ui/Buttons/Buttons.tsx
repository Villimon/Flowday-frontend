import {
    AriaAttributes,
    ButtonHTMLAttributes,
    ForwardedRef,
    forwardRef,
    memo,
    NamedExoticComponent,
    ReactNode,
    useCallback,
} from 'react';
import cls from './Buttons.module.css';
import clsx from 'clsx';

export type ButtonVariant = 'filled' | 'outline' | 'ghost' | 'clear';
export type ButtonColor = 'primary' | 'success' | 'error' | 'warning' | 'neutral';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    // Основные пропсы
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    radius?: ButtonRadius;

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
    ariaDescribedBy?: string; // дополнительное описание
    ariaControls?: string; // управление другими элементами
    ariaExpanded?: boolean; //  состояние раскрытия
    ariaPressed?: boolean; //  состояние нажатия (для toggle кнопок)
    ariaBusy?: boolean; //  состояние загрузки/обработки

    // Иконки
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';

    // Визуальные
    className?: string;

    // Для compound компонентов (future-proof)
    asChild?: boolean;
}

export const Button = memo(
    forwardRef(
        (
            {
                className,
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
                ariaBusy,
                type = 'button',
                onKeyDown,
                onClick,
                ...otherProps
            }: ButtonProps,
            ref: ForwardedRef<HTMLButtonElement>
        ) => {
            // Обработка keyboard events для accessibility
            const handleKeyDown = useCallback(
                (e: React.KeyboardEvent<HTMLButtonElement>) => {
                    // Space или Enter активируют кнопку
                    if (!disabled && !loading && (e.key === ' ' || e.key === 'Enter')) {
                        e.preventDefault();
                        if (onClick) {
                            onClick(e as any);
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
                        <span className={cls.iconWrapper} aria-hidden="true">
                            {icon}
                        </span>
                    );
                }

                if (icon && !addonLeft && !addonRight) {
                    const iconElement = (
                        <span
                            className={clsx(cls.icon, cls[`icon-${iconPosition}`])}
                            aria-hidden="true"
                        >
                            {icon}
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
                <button
                    ref={ref}
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
                </button>
            );
        }
    )
) as NamedExoticComponent<ButtonProps>;

Button.displayName = 'Button';
