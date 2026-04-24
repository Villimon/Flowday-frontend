import { FC } from 'react';
import styles from './footer.module.css';
import { Button, HStack, Text, VStack } from '@/shared/ui';
import CalendarIcon from '@/shared/assets/calendar.svg';
import SparkIcon from '@/shared/assets/spark.svg';
import { Link } from 'react-router-dom';
import { getRouteMain } from '@/shared/constants/router';
import { Chip } from '@/shared/ui/Chip/Chip';

interface FooterContentProps {
    onOpenChangelog: () => void;
}

export const FooterContent: FC<FooterContentProps> = ({ onOpenChangelog }) => {
    return (
        <>
            <HStack gap="16">
                <VStack gap="4" className={styles.logoBlock}>
                    <Button
                        className={styles.button}
                        as={Link}
                        to={getRouteMain()}
                        icon={CalendarIcon}
                        size="xl"
                        variant="clear"
                        color="primary"
                        iconColor="secondary"
                        iconWidth={26}
                        iconHeight={26}
                        iconWrapperStyle={styles.iconWrapper}
                    >
                        {'FLOWDAY'}
                    </Button>
                    <Text
                        text="Красивый планировщик и календарь задач. Организуйте день, неделю и месяц без лишнего шума."
                        variant="secondary"
                    />
                </VStack>
                <VStack gap="2" className={styles.productBlock}>
                    <Text title="Продукт" headerTag="h4" />
                    <ul>
                        <li>
                            <Button
                                className={styles.button}
                                icon={SparkIcon}
                                variant="clear"
                                color="primary"
                                iconColor="primary"
                                iconWidth={20}
                                iconHeight={20}
                                onClick={onOpenChangelog}
                            >
                                Что нового?
                            </Button>
                        </li>
                    </ul>
                </VStack>
            </HStack>
            <div className={styles.divider} />
            <HStack justify="between">
                <Text
                    text={`© ${new Date().getFullYear()} Flowday. Все права защищены.`}
                    variant="secondary"
                />
                <Chip
                    size="sm"
                    label={`v${__APP_VERSION__}`}
                    onClick={onOpenChangelog}
                    color="success"
                    variant="ghost"
                    clickable
                />
            </HStack>
        </>
    );
};
