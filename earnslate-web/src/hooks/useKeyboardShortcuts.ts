'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcuts {
    onNewTransaction?: () => void;
    onNewBudget?: () => void;
    onNewSubscription?: () => void;
}

/**
 * Global keyboard shortcuts hook
 * Ctrl/Cmd + N: New transaction (when on transactions page)
 * Ctrl/Cmd + B: Go to budgets
 * Ctrl/Cmd + S: Go to subscriptions
 * Ctrl/Cmd + D: Go to dashboard
 * Ctrl/Cmd + T: Go to transactions
 * Escape: Close modals
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts = {}) {
    const router = useRouter();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Don't trigger shortcuts when typing in inputs
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            // Only allow Escape to work in inputs
            if (e.key !== 'Escape') return;
        }

        const isMod = e.ctrlKey || e.metaKey;

        if (isMod) {
            switch (e.key.toLowerCase()) {
                case 'n':
                    e.preventDefault();
                    shortcuts.onNewTransaction?.();
                    break;
                case 'd':
                    e.preventDefault();
                    router.push('/');
                    break;
                case 't':
                    e.preventDefault();
                    router.push('/transactions');
                    break;
                case 'b':
                    e.preventDefault();
                    // Check if it's for budgets
                    if (!e.shiftKey) {
                        router.push('/budgets');
                    }
                    break;
            }
        }

        // Escape key handling (without modifiers)
        if (e.key === 'Escape') {
            // Find and click any close button in open modals
            const modal = document.querySelector('[data-modal-open="true"]');
            if (modal) {
                const closeBtn = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement;
                closeBtn?.click();
            }
        }
    }, [router, shortcuts]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Hook to track available shortcuts for help display
 */
export const KEYBOARD_SHORTCUTS = [
    { key: 'Ctrl+N', description: 'New transaction' },
    { key: 'Ctrl+D', description: 'Go to Dashboard' },
    { key: 'Ctrl+T', description: 'Go to Transactions' },
    { key: 'Ctrl+B', description: 'Go to Budgets' },
    { key: 'Escape', description: 'Close modals' },
];
