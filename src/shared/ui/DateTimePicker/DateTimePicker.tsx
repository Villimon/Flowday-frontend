import {
    InputHTMLAttributes,
    memo,
    useEffect,
    useState,
    useCallback,
    forwardRef,
    useId,
} from 'react';
import cls from './DateTimePicker.module.css';
import { Text } from '../Text/Text';
import { VStack } from '../Stack/VStack/VStack';
import clsx from 'clsx';
import { formatToDisplay } from '@/shared/lib/formatToDisplay';
import { formatToValue } from '@/shared/lib/formatToValue';

type HTMLDateTimeInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'readOnly' | 'size' | 'type'
>;

export type DateTimePickerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DateTimePickerVariant = 'outline' | 'filled' | 'ghost';
export type DateTimePickerRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface DateTimePickerProps extends HTMLDateTimeInputProps {
    // Основные — на входе и выходе формат ДД.ММ.ГГГГ ЧЧ:ММ
    value?: string;
    onChange?: (value: string) => void;

    // Визуальные
    className?: string;
    inputClassName?: string;
    size?: DateTimePickerSize;
    variant?: DateTimePickerVariant;
    radius?: DateTimePickerRadius;

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
    isOptional?: boolean;

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

// TODO: Не используется react-datepicker, понять что сделать убрать либо или внедрить
export const DateTimePicker = memo(
    forwardRef<HTMLInputElement, DateTimePickerProps>((props, ref) => {
        const {
            // Основные
            value = '',
            onChange,

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
            isOptional = false,

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
            ...otherProps
        } = props;

        const [isFocused, setIsFocused] = useState(autoFocus);
        const generatedId = useId();

        const hasError = Boolean(error) || isInvalid;

        // Конвертируем то, что ввели в инпуте, обратно в формат ДД.ММ.ГГГГ ЧЧ:ММ
        const onChangeHandler = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                let rawValue = e.target.value; // формат YYYY-MM-DDTHH:mm

                if (rawValue) {
                    const [datePart, timePart] = rawValue.split('T');

                    // Если пользователь только что выбрал дату, и нативный инпут пытается
                    // проставить текущее время, а в стейте до этого было пусто,
                    // мы заменяем время на "00:00"
                    if (!value && timePart) {
                        rawValue = `${datePart}T00:00`;
                    }
                }

                const displayValue = formatToDisplay(rawValue);
                onChange?.(displayValue);
            },
            [onChange, value]
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
        }, [autoFocus, ref]);

        const ariaProps = {
            'aria-label': ariaLabel || label,
            'aria-describedby': ariaDescribedBy || (description ? `${id}-description` : undefined),
            'aria-invalid': ariaInvalid || hasError,
            'aria-errormessage': ariaErrorMessage || (error ? `${id}-error` : undefined),
            'aria-busy': isLoading,
            'aria-disabled': disabled,
            'aria-readonly': readOnly,
        };

        const inputId = id || (name ? `${name}-datetime` : generatedId);

        // Для нативного инпута перегоняем ДД.ММ.ГГГГ ЧЧ:ММ -> YYYY-MM-DDTHH:mm
        const nativeInputValue = formatToValue(value);

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
                        {label} {required && !isOptional && <span className={cls.required}>*</span>}{' '}
                        {isOptional && !required && (
                            <span className={cls.optional}>(необязательно)</span>
                        )}
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
                        value={nativeInputValue}
                        onChange={onChangeHandler}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        type="datetime-local"
                        placeholder={placeholder}
                        disabled={disabled || isLoading}
                        readOnly={readOnly}
                        required={required}
                        className={clsx(cls.input, inputClassName, cls.dateTimeInput)}
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

DateTimePicker.displayName = 'DateTimePicker';
