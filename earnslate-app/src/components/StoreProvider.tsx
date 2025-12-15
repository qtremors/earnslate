'use client';

import { useEffect, useState, ReactNode } from 'react';
import styles from './StoreProvider.module.css';

interface StoreProviderProps {
    children: ReactNode;
}

/**
 * Prevents hydration mismatch by only rendering children after client-side mount.
 * This is required for Zustand persist middleware which uses localStorage.
 */
export default function StoreProvider({ children }: StoreProviderProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Return a loading skeleton that matches the expected layout
        return (
            <div className={styles.skeleton}>
                {/* Sidebar skeleton */}
                <div className={styles.sidebarSkeleton} />
                {/* Content skeleton */}
                <div className={styles.contentSkeleton}>
                    Loading...
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
