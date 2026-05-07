import { useCallback, useEffect, useRef, useState } from 'react';

interface UseModalProps {
    onClose?: () => void;
    isOpen?: boolean;
    animationDelay?: number;
}

/**
 * Переиспользкемый хук для модальных компонентов (drawer/modal)
 * @param animationDelay
 * @param isOpen
 * @param onClose
 * @returns
 */
export function useModal({ animationDelay, isOpen, onClose }: UseModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const closeHandler = useCallback(() => {
        if (onClose) {
            setIsClosing(true);
            timeRef.current = setTimeout(() => {
                onClose();
                setIsClosing(false);
            }, animationDelay);
        }
    }, [onClose, animationDelay]);

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeHandler();
            }
        },
        [closeHandler]
    );

    if (isOpen && !isMounted) {
        setIsMounted(true);
    }

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', onKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            if (timeRef.current) clearTimeout(timeRef.current);
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onKeyDown]);

    return { isClosing, isMounted, closeHandler };
}
