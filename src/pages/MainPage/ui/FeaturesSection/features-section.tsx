import { memo } from 'react';
import styles from './features-section.module.css';
import { HStack, Text, VStack } from '@/shared/ui';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';
import clsx from 'clsx';
import { BIG_CARD_ITEMS } from '../../model/Cards/BigCardItems';
import { FeatureCard } from './feature-card';
import { SMALL_CARD_ITEMS } from '../../model/Cards/SmallCardItems';

export const FeaturesSection = memo(() => {
    const isTabletCard = useMedia('(max-width: 1100px)');
    const isTablet = useMedia('(max-width: 768px)');

    return (
        <section className={styles.features} id="features">
            <VStack gap="32" className={'container'}>
                <VStack align="center" gap={isTablet ? '32' : '16'} className={styles.block}>
                    <Text
                        align="center"
                        size="4xl"
                        title="Всё, что нужно для концентрации"
                        text="Минимум визуального шума, максимум полезных функций."
                        headerTag="h2"
                    />
                    <HStack gap={isTablet ? '16' : '8'} wrap={isTabletCard ? 'wrap' : 'nowrap'}>
                        {BIG_CARD_ITEMS.map(item => (
                            <FeatureCard
                                className={styles.bigCard}
                                gapSize={{ desktopSize: '16', tableSize: '8' }}
                                icon={item.icon}
                                isTablet={isTablet}
                                text={item.text}
                                title={item.title}
                                key={item.id}
                            />
                        ))}
                    </HStack>
                </VStack>
                <VStack align="center" gap={isTablet ? '32' : '16'}>
                    <Text
                        align="center"
                        size="4xl"
                        title="Четыре вида — один поток"
                        text="Каждый вид заточен под свою задачу. Переключайтесь, не отвлекаясь."
                        headerTag="h2"
                    />
                    <HStack wrap={isTabletCard ? 'wrap' : 'nowrap'} gap={isTablet ? '16' : '8'}>
                        {SMALL_CARD_ITEMS.map(item => (
                            <FeatureCard
                                fullWidth={isTabletCard}
                                className={clsx(styles.smallCard, styles[item.className])}
                                gapSize={{ desktopSize: '8', tableSize: '4' }}
                                icon={item.icon}
                                isTablet={isTablet}
                                text={item.text}
                                title={item.title}
                                key={item.id}
                            />
                        ))}
                    </HStack>
                </VStack>
            </VStack>
        </section>
    );
});

FeaturesSection.displayName = 'FeaturesSection';
