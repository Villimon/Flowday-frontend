import { memo, ReactNode, useCallback } from 'react';
import { Card } from '../Card/Card';
import cls from './Tabs.module.css';
import { Flex, FlexDirection } from '../Stack/Flex/Flex';
import { Text } from '../Text/Text';
import { clsx } from 'clsx';

export interface TabItem {
    value: string;
    content: ReactNode;
    disabled?: boolean;
    icon?: ReactNode;
}

interface TabsProps {
    className?: string;
    tabs: TabItem[];
    value: string;
    onTabClick: (tab: TabItem) => void;
    direction?: FlexDirection;

    // Accessibility
    'aria-label'?: string;
    'aria-labelledby'?: string;

    // Стилизация
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Tabs = memo(
    ({
        className,
        tabs,
        value,
        onTabClick,
        direction = 'row',
        size = 'md',
        fullWidth = false,
        'aria-label': ariaLabel = 'Вкладки',
        'aria-labelledby': ariaLabelledBy,
    }: TabsProps) => {
        const handleTabClick = useCallback(
            (tab: TabItem) => {
                if (!tab.disabled) {
                    onTabClick(tab);
                }
            },
            [onTabClick]
        );

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent, tab: TabItem) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTabClick(tab);
                }
            },
            [handleTabClick]
        );

        return (
            <Flex
                gap="4"
                align="center"
                direction={direction}
                className={clsx(
                    cls.tabs,
                    {
                        [cls.fullWidth]: fullWidth,
                    },
                    [className]
                )}
                role="tablist"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
            >
                {tabs.map(tab => {
                    const isSelected = value === tab.value;

                    return (
                        <Card
                            key={tab.value}
                            radius="xl"
                            padding={'4'}
                            variant={isSelected ? 'outline' : 'elevated'}
                            className={clsx(cls.tab, {
                                [cls.selected]: isSelected,
                                [cls.disabled]: tab.disabled,
                            })}
                            onClick={() => handleTabClick(tab)}
                            onKeyDown={e => handleKeyDown(e, tab)}
                            role="tab"
                            tabIndex={isSelected ? 0 : -1}
                            aria-selected={isSelected}
                            aria-disabled={tab.disabled}
                            aria-controls={`tabpanel-${tab.value}`}
                            id={`tab-${tab.value}`}
                            data-testid={`Tab.${tab.value}`}
                        >
                            <Flex gap="2" align="center">
                                {tab.icon && (
                                    <span className={cls.icon} aria-hidden="true">
                                        {tab.icon}
                                    </span>
                                )}

                                {typeof tab.content === 'string' ? (
                                    <Text
                                        size={size}
                                        weight={isSelected ? 'medium' : 'normal'}
                                        variant={tab.disabled ? 'tertiary' : 'primary'}
                                    >
                                        {tab.content}
                                    </Text>
                                ) : (
                                    tab.content
                                )}
                            </Flex>
                        </Card>
                    );
                })}
            </Flex>
        );
    }
);

Tabs.displayName = 'Tabs';
