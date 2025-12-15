'use client';

import { useEffect, useState, ReactNode } from 'react';

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
            <div style={{
                display: 'flex',
                minHeight: '100vh',
                background: '#0a0a0a',
            }}>
                {/* Sidebar skeleton */}
                <div style={{
                    width: '260px',
                    background: '#111',
                    borderRight: '1px solid #222',
                }} />
                {/* Content skeleton */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
