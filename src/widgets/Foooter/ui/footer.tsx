import { memo, useCallback, useState } from 'react';
import styles from './footer.module.css';
import clsx from 'clsx';
import { ChanhelogModal } from './changelog-modal';
import { FooterContent } from './footer-content';

export const Footer = memo(() => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <footer className={clsx('container', styles.footer)}>
            <FooterContent onOpenChangelog={handleOpenModal} />
            {isOpen && <ChanhelogModal isOpen={isOpen} onClose={handleCloseModal} />}
        </footer>
    );
});

Footer.displayName = 'Footer';
