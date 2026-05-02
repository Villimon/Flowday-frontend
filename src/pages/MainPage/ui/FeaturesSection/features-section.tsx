import { memo } from 'react';
import styles from './features-section.module.css';
import { Card, HStack, Text, VStack } from '@/shared/ui';
import CalendarIcon from '@/shared/assets/calendar-card.svg';
import CkeckIcon from '@/shared/assets/circle-check.svg';
import LayoutIcon from '@/shared/assets/layout.svg';
import ListIcon from '@/shared/assets/list.svg';
import SparkIcon from '@/shared/assets/spark.svg';
import { Icon } from '@/shared/ui/Icon/Icon';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';
import clsx from 'clsx';

export const FeaturesSection = memo(() => {
    const isTabletCard = useMedia('(max-width: 1100px)');
    const isTablet = useMedia('(max-width: 768px)');

    return (
        <section className={styles.features} id="features">
            <VStack gap="32" className={'container'}>
                <VStack gap={isTablet ? '32' : '16'} className={styles.block}>
                    <Text
                        align="center"
                        size="4xl"
                        title="Всё, что нужно для концентрации"
                        text="Минимум визуального шума, максимум полезных функций."
                        headerTag="h2"
                    />
                    <HStack gap={isTablet ? '16' : '8'} wrap={isTabletCard ? 'wrap' : 'nowrap'}>
                        <Card className={styles.bigCard} radius="xl">
                            <VStack gap={isTablet ? '16' : '8'}>
                                <div className={styles.icon}>
                                    <Icon width={28} height={28} Svg={CkeckIcon} color="success" />
                                </div>
                                <Text size="xl" title="Умное управление задачами" />
                                <Text
                                    variant="secondary"
                                    text="Создавайте задачи с подробным описанием, цветными метками и отслеживанием выполнения. Ваши дела ещё никогда так не выглядели."
                                />
                            </VStack>
                        </Card>
                        <Card className={styles.bigCard} radius="xl">
                            <VStack gap={isTablet ? '16' : '8'}>
                                <div className={styles.icon}>
                                    <Icon
                                        width={28}
                                        height={28}
                                        Svg={CalendarIcon}
                                        color="success"
                                    />
                                </div>
                                <Text size="xl" title="Блоки времени" />
                                <Text
                                    variant="secondary"
                                    text="Назначайте время начала и окончания, превращая задачи в полноценные блоки концентрации. Вернитe контроль над расписанием."
                                />
                            </VStack>
                        </Card>
                        <Card className={styles.bigCard} radius="xl">
                            <VStack gap={isTablet ? '16' : '8'}>
                                <div className={styles.icon}>
                                    <Icon width={28} height={28} Svg={LayoutIcon} color="success" />
                                </div>
                                <Text size="xl" title="Гибкие виды" />
                                <Text
                                    variant="secondary"
                                    text="Переключайтесь между «День», «Неделя», «Месяц» и «Список». Смотрите общую картину или фокусируйтесь на сегодняшних приоритетах."
                                />
                            </VStack>
                        </Card>
                    </HStack>
                </VStack>

                <VStack gap={isTablet ? '32' : '16'}>
                    <Text
                        align="center"
                        size="4xl"
                        title="Четыре вида — один поток"
                        text="Каждый вид заточен под свою задачу. Переключайтесь, не отвлекаясь."
                        headerTag="h2"
                    />
                    <HStack wrap={isTabletCard ? 'wrap' : 'nowrap'} gap={isTablet ? '16' : '8'}>
                        <Card
                            fullWidth={isTabletCard}
                            className={clsx(styles.smallCard, styles.firstSmallCard)}
                            radius="xl"
                        >
                            <VStack gap={isTablet ? '8' : '4'}>
                                <div className={styles.icon}>
                                    <Icon width={28} height={28} Svg={SparkIcon} color="success" />
                                </div>
                                <Text size="xl" title="День" />
                                <Text
                                    variant="secondary"
                                    text="Фокус на одном дне с подробными карточками задач"
                                />
                            </VStack>
                        </Card>
                        <Card
                            fullWidth={isTabletCard}
                            className={clsx(styles.smallCard, styles.secondSmallCard)}
                            radius="xl"
                        >
                            <VStack gap={isTablet ? '8' : '4'}>
                                <div className={styles.icon}>
                                    <Icon
                                        width={28}
                                        height={28}
                                        Svg={CalendarIcon}
                                        color="success"
                                    />
                                </div>
                                <Text size="xl" title="Неделя" />
                                <Text
                                    variant="secondary"
                                    text="Семь колонок с компактными карточками всех задач"
                                />
                            </VStack>
                        </Card>
                        <Card
                            fullWidth={isTabletCard}
                            className={clsx(styles.smallCard, styles.thirdSmallCard)}
                            radius="xl"
                        >
                            <VStack gap={isTablet ? '8' : '4'}>
                                <div className={styles.icon}>
                                    <Icon width={28} height={28} Svg={LayoutIcon} color="success" />
                                </div>
                                <Text size="xl" title="Месяц" />
                                <Text
                                    variant="secondary"
                                    text="Полный календарь и адаптивная повестка для мобильных"
                                />
                            </VStack>
                        </Card>
                        <Card
                            fullWidth={isTabletCard}
                            className={clsx(styles.smallCard, styles.fourthSmallCard)}
                            radius="xl"
                        >
                            <VStack gap={isTablet ? '8' : '4'}>
                                <div className={styles.icon}>
                                    <Icon width={28} height={28} Svg={ListIcon} color="success" />
                                </div>
                                <Text size="xl" title="Список" />
                                <Text
                                    variant="secondary"
                                    text="Все задачи без привязки к датам, сгруппированы по срокам"
                                />
                            </VStack>
                        </Card>
                    </HStack>
                </VStack>
            </VStack>
        </section>
    );
});

FeaturesSection.displayName = 'FeaturesSection';
