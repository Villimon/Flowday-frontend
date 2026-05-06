import { FC, memo, SVGProps } from 'react';
import styles from './features-section.module.css';
import { Card, Text, VStack } from '@/shared/ui';
import { Icon } from '@/shared/ui/Icon/Icon';
import { FlexGap } from '@/shared/ui/Stack/Flex/Flex';

interface FeatureCardProps {
    isTablet: boolean;
    icon: FC<SVGProps<SVGSVGElement>>;
    title: string;
    text: string;
    className: string;
    fullWidth?: boolean;
    gapSize: {
        desktopSize: FlexGap;
        tableSize: FlexGap;
    };
}

export const FeatureCard: FC<FeatureCardProps> = memo(
    ({ isTablet, icon, title, text, className, fullWidth = false, gapSize }) => {
        return (
            <Card fullWidth={fullWidth} className={className} radius="xl">
                <VStack gap={isTablet ? gapSize.desktopSize : gapSize.tableSize}>
                    <div className={styles.icon}>
                        <Icon width={28} height={28} Svg={icon} color="success" />
                    </div>
                    <Text size="xl" title={title} />
                    <Text variant="secondary" text={text} />
                </VStack>
            </Card>
        );
    }
);

FeatureCard.displayName = 'FeatureCard ';
