/**
 * Unified Icon Utility
 * Handles all icon formats via Iconify - eliminates LucideIcons bundle import
 */
'use client';

import { Icon } from '@iconify/react';

interface IconProps {
    name: string;
    size?: number;
    color?: string;
    className?: string;
}

/**
 * Renders an icon based on its format:
 * - Iconify format: 'simple-icons:netflix', 'mdi:home', 'lucide:home'
 * - Double-prefixed: 'brand:simple-icons:netflix'
 * - Legacy brand: 'brand:SiNetflix' or 'SiNetflix'
 * - Lucide: 'Home', 'CreditCard' (converted to lucide:home)
 */
export function DynamicIcon({ name, size = 24, color, className }: IconProps) {
    // Handle double-prefixed format (brand:simple-icons:*)
    if (name.startsWith('brand:simple-icons:')) {
        const cleanIcon = name.replace('brand:', '');
        return (
            <Icon
                icon={cleanIcon}
                width={size}
                height={size}
                style={{ color: color || 'currentColor' }}
                className={className}
            />
        );
    }

    // Handle Iconify format (contains colon like 'simple-icons:netflix')
    if (name.includes(':')) {
        return (
            <Icon
                icon={name}
                width={size}
                height={size}
                style={{ color: color || 'currentColor' }}
                className={className}
            />
        );
    }

    // Handle legacy brand: prefix (convert to Iconify format)
    if (name.startsWith('brand:')) {
        const brandIcon = name.replace('brand:', '').replace(/^Si/, '').toLowerCase();
        return (
            <Icon
                icon={`simple-icons:${brandIcon}`}
                width={size}
                height={size}
                style={{ color: color || 'currentColor' }}
                className={className}
            />
        );
    }

    // Handle legacy react-icons/si format (SiNetflix -> simple-icons:netflix)
    if (name.startsWith('Si')) {
        const brandIcon = name.replace(/^Si/, '').toLowerCase();
        return (
            <Icon
                icon={`simple-icons:${brandIcon}`}
                width={size}
                height={size}
                style={{ color: color || 'currentColor' }}
                className={className}
            />
        );
    }

    // Handle Lucide icons via Iconify (PascalCase -> kebab-case)
    // e.g., 'UtensilsCrossed' -> 'lucide:utensils-crossed'
    const kebabName = name
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();

    return (
        <Icon
            icon={`lucide:${kebabName}`}
            width={size}
            height={size}
            style={{ color: color || 'currentColor' }}
            className={className}
        />
    );
}

/**
 * Check if an icon name is a brand icon (Iconify format)
 */
export function isBrandIcon(name: string): boolean {
    return name.includes(':') || name.startsWith('brand:') || name.startsWith('Si');
}

/**
 * Normalize icon name to Iconify format
 */
export function normalizeIconName(name: string): string {
    if (name.includes(':')) return name;
    if (name.startsWith('brand:')) {
        const brandIcon = name.replace('brand:', '').replace(/^Si/, '').toLowerCase();
        return `simple-icons:${brandIcon}`;
    }
    if (name.startsWith('Si')) {
        return `simple-icons:${name.replace(/^Si/, '').toLowerCase()}`;
    }
    // Convert Lucide PascalCase to kebab-case
    const kebabName = name
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
    return `lucide:${kebabName}`;
}
