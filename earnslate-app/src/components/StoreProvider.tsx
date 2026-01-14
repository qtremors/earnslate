'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import styles from './StoreProvider.module.css';

interface StoreProviderProps {
    children: ReactNode;
}

/**
 * Prevents hydration mismatch by only rendering children after client-side mount.
 * This is required for Zustand persist middleware which uses localStorage.
 * Also handles theme application.
 */
export default function StoreProvider({ children }: StoreProviderProps) {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const theme = useAppStore((state) => state.settings.theme);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Check onboarding status
    useEffect(() => {
        if (!isClient) return;

        // Give a small grace period for hydration to settle
        const checkOnboarding = () => {
            const hasCompleted = useAppStore.getState().settings.hasCompletedOnboarding;

            // Allow access to onboarding page regardless of status
            if (pathname === '/onboarding') {
                return;
            }

            if (!hasCompleted) {
                router.replace('/onboarding');
            }
        };

        checkOnboarding();
    }, [isClient, pathname, router]);

    // Apply theme
    useEffect(() => {
        if (!isClient) return;

        const root = document.documentElement;

        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e: MediaQueryListEvent) => {
                root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            };
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        } else {
            root.setAttribute('data-theme', theme);
        }
    }, [isClient, theme]);

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

