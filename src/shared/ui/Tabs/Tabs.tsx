import { memo, ReactNode, useCallback } from 'react';
import { Card } from '../Card/Card';
import cls from './Tabs.module.css';
import { Flex, FlexDirection } from '../Stack/Flex/Flex';
import { Text, TextSize } from '../Text/Text';
import { clsx } from 'clsx';
import { Icon } from '../Icon/Icon';
import { Chip } from '../Chip/Chip';

export interface TabItem {
    value: string;
    content: ReactNode;
    disabled?: boolean;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    count?: number;
}

interface TabsProps {
    className?: string;
    tabs: TabItem[];
    value: string;
    onTabClick: (tab: TabItem) => void;
    direction?: FlexDirection;
    iconOnlyOnMobile?: boolean;

    // Accessibility
    'aria-label'?: string;
    'aria-labelledby'?: string;

    // Стилизация
    size?: TextSize;
    fullWidth?: boolean;
}

export const Tabs = memo(
    ({
        className,
        tabs,
        value,
        onTabClick,
        direction = 'row',
        size = 'xs',
        fullWidth = false,
        iconOnlyOnMobile = false,
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
                gap="1"
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
                            radius="lg"
                            variant={isSelected ? 'outline' : 'ghost'}
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
                                {tab.Icon && (
                                    <span className={cls.icon} aria-hidden="true">
                                        <Icon Svg={tab.Icon} />
                                    </span>
                                )}

                                {typeof tab.content === 'string' ? (
                                    <>
                                        {!iconOnlyOnMobile && (
                                            <Text
                                                size={size}
                                                variant={tab.disabled ? 'tertiary' : 'primary'}
                                            >
                                                {tab.content}
                                            </Text>
                                        )}
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <Chip
                                                label={String(tab.count)}
                                                size="xs"
                                                variant="filled"
                                                color={isSelected ? 'primary' : 'neutral'}
                                                className={cls.count}
                                            />
                                        )}
                                    </>
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
