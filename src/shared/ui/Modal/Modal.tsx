import { ReactNode } from 'react';
import cls from './Modal.module.css';
import clsx from 'clsx';
import { Portal } from '../Portal/Portal';
import { Overlay } from '../Overlay/Overlay';
import { useModal } from '@/shared/lib/hooks/useModal/useModal';
import { Card } from '../Card/Card';
import { Text, TextElement } from '../Text/Text';
import { HStack } from '../Stack/HStack/HStack';
import { Button } from '../Buttons/Buttons';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant = 'default' | 'danger' | 'success' | 'warning';

interface ModalProps {
    // Основные пропсы
    isOpen: boolean;
    onClose?: () => void;
    children: ReactNode;

    // Визуальные
    className?: string;
    overlayClassName?: string;
    contentClassName?: string;
    size?: ModalSize;
    variant?: ModalVariant;

    // Поведение
    lazy?: boolean;
    closeOnOverlayClick?: boolean;
    showOverlay?: boolean;
    showCloseButton?: boolean;

    // Accessibility
    title?: string;
    description?: string;
    role?: 'dialog' | 'alertdialog';
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;

    // Тестирование
    'data-testid'?: string;
}

const variantToCardVariant: Record<ModalVariant, 'elevated' | 'outline'> = {
    default: 'elevated',
    danger: 'outline',
    success: 'outline',
    warning: 'outline',
};

export const Modal = ({
    // Основные
    className,
    children,
    isOpen,
    onClose,

    // Визуальные
    overlayClassName,
    contentClassName,
    size = 'sm',
    variant = 'default',

    // Поведение
    lazy = false,
    closeOnOverlayClick = true,
    showOverlay = true,
    showCloseButton = true,

    // Accessibility
    title,
    description,
    role = 'dialog',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,

    // Тестирование
    'data-testid': dataTestId = 'Modal',
}: ModalProps) => {
    const { closeHandler, isClosing, isMounted } = useModal({
        animationDelay: 300,
        isOpen,
        onClose,
    });

    if (lazy && !isMounted) {
        return null;
    }

    const ariaProps = {
        role,
        'aria-modal': true as const,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy || (title ? 'modal-title' : undefined),
        'aria-describedby': ariaDescribedBy || (description ? 'modal-description' : undefined),
    };

    Object.keys(ariaProps).forEach(key => {
        if (ariaProps[key as keyof typeof ariaProps] === undefined) {
            delete ariaProps[key as keyof typeof ariaProps];
        }
    });

    return (
        <Portal>
            <div
                className={clsx(
                    cls.modal,
                    {
                        [cls.opened]: isOpen,
                        [cls.closing]: isClosing,
                        [cls.hidden]: !isOpen,
                    },
                    className
                )}
                data-testid={dataTestId}
            >
                {showOverlay && (
                    <Overlay
                        className={overlayClassName}
                        onClick={closeOnOverlayClick ? closeHandler : undefined}
                        blur
                    />
                )}

                <Card
                    variant={variantToCardVariant[variant]}
                    padding="0"
                    radius="lg"
                    className={clsx(
                        cls.content,
                        cls[`size-${size}`],
                        cls[`variant-${variant}`],
                        contentClassName
                    )}
                    {...ariaProps}
                >
                    {(title || (onClose && showCloseButton)) && (
                        <div className={cls.header}>
                            <HStack justify="between" align="center" className={cls.headerContent}>
                                {title ? (
                                    <Text
                                        id="modal-title"
                                        as={'h2' as TextElement}
                                        size="xl"
                                        weight="semibold"
                                        className={cls.title}
                                    >
                                        {title}
                                    </Text>
                                ) : (
                                    <div /> // Пустой элемент для выравнивания
                                )}

                                {onClose && showCloseButton && (
                                    <Button
                                        variant="clear"
                                        size="sm"
                                        onClick={closeHandler}
                                        iconOnly
                                        aria-label="Закрыть модальное окно"
                                        className={cls.closeButton}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path
                                                d="M1 1L13 13M13 1L1 13"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                        </svg>
                                    </Button>
                                )}
                            </HStack>
                        </div>
                    )}

                    <div className={cls.contentWrapper}>
                        {description && (
                            <Text
                                id="modal-description"
                                variant="secondary"
                                size="sm"
                                className={cls.description}
                            >
                                {description}
                            </Text>
                        )}

                        <div className={cls.childrenContent}>{children}</div>
                    </div>
                </Card>
            </div>
        </Portal>
    );
};
