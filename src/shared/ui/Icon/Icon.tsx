import { FC, memo, NamedExoticComponent } from 'react';
import cls from './Icon.module.css';
import clsx from 'clsx';

type SvgProps = Omit<React.SVGProps<SVGSVGElement>, 'onClick'>;

interface IconBaseProps extends SvgProps {
    className?: string;
    Svg: React.FC<React.SVGProps<SVGSVGElement>>;

    // Accessibility
    'aria-label'?: string;
    'aria-hidden'?: boolean;
    role?: string;

    // Size (используем наши переменные)
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

    // Color (используем наши цвета)
    color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'current';
}

interface NonClickableIconProps extends IconBaseProps {
    clickable?: false;
}

interface ClickableBaseProps extends IconBaseProps {
    clickable: true;
    onClick: () => void;
    disabled?: boolean;

    // Accessibility для кнопки
    'aria-label': string; // обязателен для clickable иконок
    'aria-describedby'?: string;
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
    'aria-pressed'?: boolean;
}

type IconProps = ClickableBaseProps | NonClickableIconProps;

export const Icon: FC<IconProps> = memo(props => {
    const {
        Svg,
        color = 'current',
        clickable = false,
        className,
        'aria-label': ariaLabel,
        'aria-hidden': ariaHidden,
        role,
        width = 32,
        height = 32,
        ...otherProps
    } = props;

    // SVG элемент с accessibility
    const icon = (
        <Svg
            width={width}
            height={height}
            className={clsx(cls.icon, cls[`color-${color}`], className)}
            aria-hidden={ariaHidden ?? (!clickable && !ariaLabel)}
            aria-label={!clickable ? ariaLabel : undefined}
            role={role ?? (!clickable && ariaLabel ? 'img' : 'presentation')}
            focusable="false" // Убираем из фокуса, если не интерактивная
            {...otherProps}
        />
    );

    // Если иконка кликабельная, оборачиваем в кнопку
    if (clickable) {
        const { onClick, disabled, ...clickableProps } = props as ClickableBaseProps;

        // Собираем ARIA атрибуты для кнопки
        const buttonAriaProps = {
            'aria-label': clickableProps['aria-label'],
            'aria-describedby': clickableProps['aria-describedby'],
            'aria-expanded': clickableProps['aria-expanded'],
            'aria-controls': clickableProps['aria-controls'],
            'aria-pressed': clickableProps['aria-pressed'],
            'aria-disabled': disabled,
        };

        return (
            <button
                type="button"
                className={clsx(cls.button, {
                    [cls.disabled]: disabled,
                })}
                onClick={onClick}
                disabled={disabled}
                style={{ width, height }}
                {...buttonAriaProps}
            >
                {icon}
            </button>
        );
    }

    return icon;
}) as NamedExoticComponent<IconProps>;

Icon.displayName = 'Icon';
