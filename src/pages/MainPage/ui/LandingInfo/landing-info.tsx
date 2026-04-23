import { memo } from 'react';
import styles from './landing-info.module.css';
import { Button, HStack, Text, VStack } from '@/shared/ui';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';
import clsx from 'clsx';
import { useGetStartedAction } from '../../model/hooks/useGetStartedAction';

export const LandingInfo = memo(() => {
    const isTablet = useMedia('(max-width: 768px)');
    const getStartedAction = useGetStartedAction({});

    return (
        <section className={clsx(styles.info, 'container')}>
            <VStack gap="16" align="center">
                <VStack>
                    <Text size="7xl" align="center" variant="accent" title="Планируй день." />
                    <Text
                        size="7xl"
                        align="center"
                        title="Покоряй неделю."
                        as={'span'}
                        className={styles.title}
                        headerTag="h2"
                    />
                </VStack>
                <VStack className={styles.description}>
                    <Text
                        variant="secondary"
                        align="center"
                        size="3xl"
                        text="Красивый планировщик, календарь и менеджер задач. Организуйте свою жизнь с удобными видами «День», «Неделя», «Месяц» и списком."
                    />
                </VStack>
                <HStack gap={isTablet ? '16' : '8'} wrap={isTablet ? 'wrap' : 'nowrap'}>
                    {getStartedAction}
                    <Button
                        as={'a'}
                        href={'#features'}
                        fullWidth={isTablet ? true : false}
                        size="lg"
                        radius="xl"
                    >
                        Узнать больше
                    </Button>
                </HStack>
            </VStack>
        </section>
    );
});

LandingInfo.displayName = 'LandingInfo';
