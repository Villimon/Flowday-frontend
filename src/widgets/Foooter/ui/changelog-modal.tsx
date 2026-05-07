import { FC } from 'react';
import styles from './footer.module.css';
import { HStack, Modal, Text, VStack } from '@/shared/ui';
import { Chip } from '@/shared/ui/Chip/Chip';
import { changeLog } from '../model/changelog/changelogData';
import {
    mapStatusItemChangeLogToColor,
    mapStatusItemChangeLogToIcon,
    mapStatusItemChangeLogToLabel,
} from '../model/changelog/mappings';

interface ChanhelogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// TODO: когда будет больше 10 записей сделать его ленивым
export const ChangelogModal: FC<ChanhelogModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal size="lg" isOpen={isOpen} onClose={onClose} title="Что нового">
            {changeLog.map(item => {
                return (
                    <VStack key={item.id} className={styles.changeLog} gap="8">
                        <HStack fullWidth justify="between">
                            <VStack fullWidth gap="2">
                                <HStack align="center" gap="4">
                                    <Text size="xl" weight="bold" text={item.version} />
                                    <Text size="xs" text={item.dateRelese} />
                                </HStack>
                                <Text text={item.description} />
                            </VStack>
                            {item.isActuale && (
                                <Chip
                                    size="sm"
                                    label="Актуальная"
                                    color="cyan"
                                    variant="ghost"
                                    isUpperCase
                                />
                            )}
                        </HStack>
                        <ul>
                            {item.items.map(i => (
                                <li key={i.id} className={styles.item}>
                                    <HStack fullWidth gap="4">
                                        <Chip
                                            size="sm"
                                            label={mapStatusItemChangeLogToLabel[i.status]}
                                            color={mapStatusItemChangeLogToColor[i.status]}
                                            variant="ghost"
                                            icon={mapStatusItemChangeLogToIcon[i.status]}
                                            iconHeight={12}
                                            iconWidth={12}
                                            isUpperCase
                                        />
                                        <Text text={i.description} />
                                    </HStack>
                                </li>
                            ))}
                        </ul>
                    </VStack>
                );
            })}
        </Modal>
    );
};
