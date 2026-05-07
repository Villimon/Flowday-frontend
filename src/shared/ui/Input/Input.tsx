import {
    InputHTMLAttributes,
    memo,
    useEffect,
    useState,
    useCallback,
    forwardRef,
    useId,
} from 'react';
import cls from './Input.module.css';
import { Text } from '../Text/Text';
import { VStack } from '../Stack/VStack/VStack';
import clsx from 'clsx';

type HTMLInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'readOnly' | 'size'
>;

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InputVariant = 'outline' | 'filled' | 'ghost';
export type InputRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface InputProps extends HTMLInputProps {
    // Основные
    value?: string;
    onChange?: (value: string) => void;

    // Визуальные
    className?: string;
    inputClassName?: string;
    size?: InputSize;
    variant?: InputVariant;
    radius?: InputRadius;

    // Контент
    label?: string;
    placeholder?: string;
    description?: string;
    error?: string;

    // Состояния
    disabled?: boolean;
    readOnly?: boolean;
    isLoading?: boolean;
    isInvalid?: boolean;

    // Поведение
    autoFocus?: boolean;
    fullWidth?: boolean;

    // Accessibility
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-errormessage'?: string;
}

export const Input = memo(
    forwardRef<HTMLInputElement, InputProps>((props, ref) => {
        const {
            // Основные
            value,
            onChange,
            type = 'text',

            // Визуальные
            className,
            inputClassName,
            size = 'md',
            variant = 'outline',
            radius = 'md',

            // Контент
            label,
            placeholder,
            description,
            error,

            // Состояния
            disabled = false,
            readOnly = false,
            isLoading = false,
            isInvalid = false,

            // Поведение
            autoFocus = false,
            fullWidth = true,

            // Accessibility
            id,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedBy,
            'aria-invalid': ariaInvalid,
            'aria-errormessage': ariaErrorMessage,

            // HTML атрибуты
            name,
            required,
            maxLength,
            minLength,
            pattern,
            ...otherProps
        } = props;

        const [isFocused, setIsFocused] = useState(autoFocus);
        const generatedId = useId();

        const hasError = Boolean(error) || isInvalid;

        const onChangeHandler = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                onChange?.(e.target.value);
            },
            [onChange]
        );

        const onFocus = useCallback(() => {
            if (!readOnly && !disabled) {
                setIsFocused(true);
            }
        }, [readOnly, disabled]);

        const onBlur = useCallback(() => {
            setIsFocused(false);
        }, []);

        useEffect(() => {
            if (autoFocus && ref && 'current' in ref && ref.current) {
                ref.current.focus();
            }
        }, [autoFocus, ref, setIsFocused]);

        const ariaProps = {
            'aria-label': ariaLabel || label,
            'aria-describedby': ariaDescribedBy || (description ? `${id}-description` : undefined),
            'aria-invalid': ariaInvalid || hasError,
            'aria-errormessage': ariaErrorMessage || (error ? `${id}-error` : undefined),
            'aria-busy': isLoading,
            'aria-disabled': disabled,
            'aria-readonly': readOnly,
        };

        const inputId = id || (name ? `${name}-input` : generatedId);

        return (
            <VStack gap="2" align="stretch" fullWidth={fullWidth} className={className}>
                {label && (
                    <Text
                        as="label"
                        htmlFor={inputId}
                        size="sm"
                        weight="medium"
                        className={cls.label}
                    >
                        {label}
                        {required && <span className={cls.required}>*</span>}
                    </Text>
                )}

                <div
                    className={clsx(
                        cls.inputWrapper,
                        cls[`size-${size}`],
                        cls[`variant-${variant}`],
                        cls[`radius-${radius}`],
                        {
                            [cls.focused]: isFocused,
                            [cls.disabled]: disabled,
                            [cls.readOnly]: readOnly,
                            [cls.error]: hasError,
                            [cls.loading]: isLoading,
                        }
                    )}
                >
                    <input
                        ref={ref}
                        id={inputId}
                        name={name}
                        value={value}
                        onChange={onChangeHandler}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled || isLoading}
                        readOnly={readOnly}
                        required={required}
                        maxLength={maxLength}
                        minLength={minLength}
                        pattern={pattern}
                        className={clsx(cls.input, inputClassName)}
                        {...ariaProps}
                        {...otherProps}
                    />

                    {isLoading && (
                        <div className={cls.loader} aria-hidden="true">
                            <div className={cls.spinner} />
                        </div>
                    )}
                </div>

                {description && !hasError && (
                    <Text
                        id={`${inputId}-description`}
                        variant="tertiary"
                        size="xs"
                        className={cls.description}
                    >
                        {description}
                    </Text>
                )}

                {error && (
                    <Text
                        id={`${inputId}-error`}
                        variant="error"
                        size="xs"
                        className={cls.errorMessage}
                        role="alert"
                        aria-live="polite"
                    >
                        {error}
                    </Text>
                )}
            </VStack>
        );
    })
);

Input.displayName = 'Input';
