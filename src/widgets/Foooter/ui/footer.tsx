import { memo, useCallback, useState } from 'react';
import styles from './footer.module.css';
import clsx from 'clsx';
import { ChangelogModal } from './changelog-modal';
import { FooterContent } from './footer-content';
import { VStack } from '@/shared/ui';

export const Footer = memo(() => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <footer className={clsx(styles.footer)}>
            <VStack fullWidth className="container">
                <FooterContent onOpenChangelog={handleOpenModal} />
                {isOpen && <ChangelogModal isOpen={isOpen} onClose={handleCloseModal} />}
            </VStack>
        </footer>
    );
});

Footer.displayName = 'Footer';
