import { FC, memo, ReactNode } from 'react';
import cls from './Text.module.css';
import clsx from 'clsx';

export type TextVariant =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'error'
    | 'warning'
    | 'accent';
export type TextAlign = 'left' | 'right' | 'center' | 'justify';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
export type TextElement = 'p' | 'span' | 'div' | 'label' | 'legend';

type HeaderTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const mapSizeToHeaderTag: Record<TextSize, HeaderTagType> = {
    xs: 'h6',
    sm: 'h5',
    md: 'h4',
    lg: 'h3',
    xl: 'h2',
    '2xl': 'h1',
    '3xl': 'h1',
    '4xl': 'h1',
};

interface TextProps {
    // Контент
    children?: ReactNode;
    title?: string;
    text?: string;

    // Визуальные пропсы
    className?: string;
    variant?: TextVariant;
    align?: TextAlign;
    size?: TextSize;
    weight?: TextWeight;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    truncate?: boolean;
    nowrap?: boolean;

    // Семантика
    as?: TextElement;
    htmlFor?: string; // Для label

    // Accessibility
    id?: string;
    'aria-label'?: string; // когда текст не виден, но нужен для screen reader
    'aria-labelledby'?: string; // для связывания текста с элементами форм
    'aria-describedby'?: string;
    'aria-live'?: 'off' | 'polite' | 'assertive'; // для динамически обновляемого текста (уведомления, счетчики)
    'aria-atomic'?: boolean;
    'aria-busy'?: boolean;
    role?: string;
    lang?: string;

    // Тестирование
    'data-testid'?: string;
}

export const Text: FC<TextProps> = memo(
    ({
        className,
        children,
        title,
        text,
        variant = 'primary',
        align = 'left',
        size = 'md',
        weight,
        italic = false,
        underline = false,
        strikethrough = false,
        truncate = false,
        nowrap = false,
        as: Element = 'div',
        htmlFor,
        id,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'aria-live': ariaLive,
        'aria-atomic': ariaAtomic,
        'aria-busy': ariaBusy,
        role,
        lang,
        'data-testid': dataTestId = 'Text',
    }) => {
        const HeaderTag = mapSizeToHeaderTag[size];

        // Собираем accessibility атрибуты
        const accessibilityProps = {
            id,
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledBy,
            'aria-describedby': ariaDescribedBy,
            'aria-live': ariaLive,
            'aria-atomic': ariaAtomic,
            'aria-busy': ariaBusy,
            role,
            lang,
        };

        // Очищаем undefined значения
        Object.keys(accessibilityProps).forEach(key => {
            if (accessibilityProps[key as keyof typeof accessibilityProps] === undefined) {
                delete accessibilityProps[key as keyof typeof accessibilityProps];
            }
        });

        const content = children || text;

        return (
            <Element
                className={clsx(
                    cls.textWrapper,
                    cls[`variant-${variant}`],
                    cls[`align-${align}`],
                    cls[`size-${size}`],
                    {
                        [cls.italic]: italic,
                        [cls.underline]: underline,
                        [cls.strikethrough]: strikethrough,
                        [cls.truncate]: truncate,
                        [cls.nowrap]: nowrap,
                        [cls[`weight-${weight}`]]: weight,
                    },
                    className
                )}
                data-testid={dataTestId}
                {...(htmlFor && { htmlFor })}
                {...accessibilityProps}
            >
                {title && (
                    <HeaderTag data-testid={`${dataTestId}.Header`} className={cls.title}>
                        {title}
                    </HeaderTag>
                )}

                {content && (
                    <div className={cls.content}>
                        {typeof content === 'string' ? (
                            <p data-testid={`${dataTestId}.Paragraph`} className={cls.paragraph}>
                                {content}
                            </p>
                        ) : (
                            <div data-testid={`${dataTestId}.Content`} className={cls.children}>
                                {content}
                            </div>
                        )}
                    </div>
                )}
            </Element>
        );
    }
);

Text.displayName = 'Text';
