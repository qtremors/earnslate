'use client';

import { useEffect, useState, ReactNode } from 'react';

interface HydrationGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Prevents hydration mismatch by only rendering children after client-side hydration.
 * This is necessary for components that use localStorage (like Zustand persist).
 */
export default function HydrationGuard({ children, fallback = null }: HydrationGuardProps) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        return fallback;
    }

    return children;
}
