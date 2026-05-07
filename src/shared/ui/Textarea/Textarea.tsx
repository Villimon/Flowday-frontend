// shared/ui/Textarea/Textarea.tsx
import {
    TextareaHTMLAttributes,
    forwardRef,
    memo,
    useCallback,
    useId,
    useLayoutEffect,
    useRef,
} from 'react';
import cls from './Textarea.module.css';
import clsx from 'clsx';
import { VStack } from '../Stack/VStack/VStack';
import { Text } from '../Text/Text';

type HTMLTextareaProps = Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'onChange' | 'readOnly' | 'size'
>;

export type TextareaSize = 'xs' | 'sm' | 'md' | 'lg';
export type TextareaVariant = 'outline' | 'filled' | 'ghost';
export type TextareaRadius = 'sm' | 'md' | 'lg';

interface TextareaProps extends HTMLTextareaProps {
    // Основные
    value?: string;
    onChange?: (value: string) => void;

    // Визуальные
    className?: string;
    size?: TextareaSize;
    variant?: TextareaVariant;
    radius?: TextareaRadius;

    // Контент
    label?: string;
    placeholder?: string;
    description?: string;
    error?: string;
    hint?: string;

    // Состояния
    disabled?: boolean;
    readOnly?: boolean;
    isLoading?: boolean;
    isInvalid?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';

    // Layout
    rows?: number;
    fullWidth?: boolean;
    autoResize?: boolean;

    // Accessibility
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-errormessage'?: string;
}

const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
};

export const Textarea = memo(
    forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
        const {
            value,
            onChange,
            className,
            size = 'md',
            variant = 'outline',
            radius = 'md',
            label,
            placeholder,
            description,
            error,
            hint,
            disabled = false,
            readOnly = false,
            isLoading = false,
            isInvalid = false,
            rows = 4,
            fullWidth = true,
            autoResize = false,
            id,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedBy,
            'aria-invalid': ariaInvalid,
            'aria-errormessage': ariaErrorMessage,
            name,
            ...otherProps
        } = props;
        const internalRef = useRef<HTMLTextAreaElement | null>(null);
        const generatedId = useId();

        const setRefs = useCallback(
            (node: HTMLTextAreaElement) => {
                internalRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
            },
            [ref]
        );

        useLayoutEffect(() => {
            if (autoResize && internalRef.current) {
                adjustHeight(internalRef.current);
            }
        }, [value, autoResize]);

        const hasError = Boolean(error) || isInvalid;
        const textareaId = id || (name ? `${name}-textarea` : generatedId);

        const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(e.target.value);

            // Автоматический resize
            if (autoResize) {
                adjustHeight(e.target);
            }
        };

        const ariaProps = {
            'aria-label': ariaLabel || label,
            'aria-describedby':
                ariaDescribedBy || (description ? `${textareaId}-description` : undefined),
            'aria-invalid': ariaInvalid || hasError,
            'aria-errormessage': ariaErrorMessage || (error ? `${textareaId}-error` : undefined),
            'aria-busy': isLoading,
            'aria-disabled': disabled,
            'aria-readonly': readOnly,
        };

        return (
            <VStack gap="2" align="stretch" fullWidth={fullWidth} className={className}>
                {label && (
                    <Text as="label" htmlFor={textareaId} size="sm" weight="medium">
                        {label}
                    </Text>
                )}

                <div
                    className={clsx(
                        cls.wrapper,
                        cls[`size-${size}`],
                        cls[`variant-${variant}`],
                        cls[`radius-${radius}`],
                        {
                            [cls.error]: hasError,
                            [cls.disabled]: disabled,
                            [cls.focused]: false,
                        }
                    )}
                >
                    <textarea
                        ref={setRefs}
                        id={textareaId}
                        value={value}
                        onChange={onChangeHandler}
                        placeholder={placeholder}
                        rows={rows}
                        disabled={disabled || isLoading}
                        readOnly={readOnly}
                        className={clsx(cls.textarea, {
                            [cls.autoResize]: autoResize,
                        })}
                        {...ariaProps}
                        {...otherProps}
                    />
                </div>

                {description && !hasError && (
                    <Text id={`${textareaId}-description`} variant="tertiary" size="xs">
                        {description}
                    </Text>
                )}

                {hint && !hasError && (
                    <Text variant="tertiary" size="xs">
                        {hint}
                    </Text>
                )}

                {error && (
                    <Text variant="error" size="xs" role="alert">
                        {error}
                    </Text>
                )}
            </VStack>
        );
    })
);

Textarea.displayName = 'Textarea';
