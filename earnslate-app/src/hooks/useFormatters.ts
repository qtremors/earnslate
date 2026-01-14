'use client';

import { useAppStore, useShallow } from '@/store';
import { useCallback, useMemo } from 'react';

/**
 * Custom hook for formatting utilities that respect user settings.
 * Centralizes all formatting logic to avoid duplication across pages.
 */
export function useFormatters() {
    const settings = useAppStore(useShallow((state) => state.settings));

    const formatCurrency = useCallback((amount: number, useAbsolute = true) => {
        const value = useAbsolute ? Math.abs(amount) : amount;
        return `${settings.currencySymbol}${value.toLocaleString(settings.locale || 'en-IN')}`;
    }, [settings.currencySymbol, settings.locale]);

    const formatCurrencyCompact = useCallback((amount: number) => {
        const abs = Math.abs(amount);
        const symbol = settings.currencySymbol;
        const locale = settings.locale || 'en-IN';
        const sign = amount < 0 ? '-' : '';

        // Use Indian numbering system for en-IN
        if (locale === 'en-IN') {
            if (abs >= 10000000) return `${sign}${symbol}${(abs / 10000000).toFixed(1)}Cr`;
            if (abs >= 100000) return `${sign}${symbol}${(abs / 100000).toFixed(1)}L`;
            if (abs >= 1000) return `${sign}${symbol}${(abs / 1000).toFixed(1)}K`;
            return `${sign}${symbol}${abs.toLocaleString(locale)}`;
        }

        // Use International system for other locales
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: settings.currency || 'USD',
            notation: 'compact',
            maximumFractionDigits: 1,
            // Intl handles sign automatically
        }).format(amount);
    }, [settings.currencySymbol, settings.locale, settings.currency]);

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString(settings.locale || 'en-IN', {
            day: 'numeric',
            month: 'short',
        });
    }, [settings.locale]);

    const formatDateLong = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString(settings.locale || 'en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }, [settings.locale]);

    const formatDateInput = useCallback((dateString: string) => {
        const date = new Date(dateString);
        const format = settings.dateFormat || 'DD/MM/YYYY';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        switch (format) {
            case 'MM/DD/YYYY':
                return `${month}/${day}/${year}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            default:
                return `${day}/${month}/${year}`;
        }
    }, [settings.dateFormat]);

    return {
        formatCurrency,
        formatCurrencyCompact,
        formatDate,
        formatDateLong,
        formatDateInput,
        currencySymbol: settings.currencySymbol,
        locale: settings.locale,
    };
}
