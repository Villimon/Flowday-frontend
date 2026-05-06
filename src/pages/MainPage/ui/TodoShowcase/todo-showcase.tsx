import { memo } from 'react';
import styles from './todo-showcase.module.css';
import { Card, Text, VStack } from '@/shared/ui';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';
import ZapIcon from '@/shared/assets/zap.svg';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/Icon/Icon';
import { GetStartedButton } from '@/features/GetStartedButton';

export const TodoShowcase = memo(() => {
    const isTablet = useMedia('(max-width: 768px)');

    return (
        <section className={clsx('container', styles.showcase)}>
            <Card className={styles.card} radius="xl">
                <VStack gap={isTablet ? '16' : '8'} align="center">
                    <div className={styles.icon}>
                        <Icon width={48} height={48} Svg={ZapIcon} color="secondary" />
                    </div>
                    <Text
                        align="center"
                        size="5xl"
                        title="Готовы навести порядок в делах?"
                        text="Зарегистрируйтесь и пробуйте прямо сейчас."
                    />
                    <GetStartedButton buttonColor="neutral" />
                </VStack>
            </Card>
        </section>
    );
});

TodoShowcase.displayName = 'TodoShowcase';
