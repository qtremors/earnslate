'use client';

import { useAppStore, useShallow } from '@/store';
import styles from './Header.module.css';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const displayName = useAppStore(useShallow((state) => state.settings.displayName));

    return (
        <header className={styles.header}>
            <div className={styles.titleSection}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>

            <div className={styles.actions}>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>{displayName}</span>
                </div>
            </div>
        </header>
    );
}
