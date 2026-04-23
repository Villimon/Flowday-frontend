import { FC, memo, ReactNode, SVGProps, useCallback, useEffect, useRef, useState } from 'react';
import cls from './Menu.module.css';
import clsx from 'clsx';
import { Button, ButtonColor, IconColor } from '@/shared/ui/Buttons/Buttons';

type MenuDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface MenuItem {
    content: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    Icon?: FC<SVGProps<SVGSVGElement>>;
    color?: ButtonColor;
}

interface MenuProps {
    className?: string;
    items: MenuItem[];
    trigger: ReactNode;
    headerContent?: ReactNode;
    direction?: MenuDirection;
}

export const Menu: FC<MenuProps> = memo(
    ({ className, items, trigger, direction = 'bottom-right', headerContent }) => {
        const [isOpen, setIsOpen] = useState(false);
        const menuRef = useRef<HTMLDivElement>(null);

        const handleToggle = useCallback(() => {
            setIsOpen(prev => !prev);
        }, []);

        const handleItemClick = useCallback((item: MenuItem) => {
            if (item.disabled) return;

            item.onClick?.();
            setIsOpen(false);
        }, []);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
                return () => {
                    document.removeEventListener('mousedown', handleClickOutside);
                };
            }
        }, [isOpen]);

        return (
            <div ref={menuRef} className={clsx(cls.menu, className)}>
                <div onClick={handleToggle} className={cls.trigger}>
                    {trigger}
                </div>
                {isOpen && (
                    <div className={clsx(cls.content, cls[direction])}>
                        {headerContent && <div className={cls.headerContent}>{headerContent}</div>}
                        <div className={cls.items}>
                            {items.map((item, index) => (
                                <Button
                                    key={index}
                                    type="button"
                                    className={clsx(cls.item, { [cls.disabled]: item.disabled })}
                                    onClick={() => handleItemClick(item)}
                                    disabled={item.disabled}
                                    fullWidth
                                    variant="clear"
                                    color={item.color ? item.color : 'primary'}
                                    icon={item.Icon}
                                    iconWidth={16}
                                    iconHeight={16}
                                    iconColor={item.color ? (item.color as IconColor) : 'secondary'}
                                    alignText="left"
                                >
                                    {item.content}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

Menu.displayName = 'Menu';
