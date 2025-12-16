'use client';

import { lazy, Suspense, ComponentType, createElement } from 'react';
import type { LucideProps } from 'lucide-react';

// Icon component type
type IconComponent = ComponentType<LucideProps>;

// Cache for loaded icons
const iconCache = new Map<string, IconComponent>();

// Fallback icon for loading states
const IconFallback = () => null;

/**
 * Get a Lucide icon component by name with lazy loading.
 * This reduces the initial bundle size by only loading icons as needed.
 */
export const getLucideIcon = (iconName: string): IconComponent => {
    // Return from cache if already loaded
    if (iconCache.has(iconName)) {
        return iconCache.get(iconName)!;
    }

    // Create a lazy-loaded component
    const LazyIcon = lazy(async () => {
        try {
            // Dynamic import of the specific icon
            const lucideModule = await import('lucide-react');
            const IconComponent = (lucideModule as unknown as Record<string, IconComponent>)[iconName];

            if (IconComponent) {
                // Cache the loaded icon
                iconCache.set(iconName, IconComponent);
                return { default: IconComponent };
            }
        } catch {
            // Silently fail and return fallback
        }

        // Fallback to HelpCircle if icon not found
        const { HelpCircle } = await import('lucide-react');
        return { default: HelpCircle };
    });

    // Wrap in a component that handles Suspense
    const WrappedIcon: IconComponent = (props) =>
        createElement(Suspense, { fallback: createElement(IconFallback) },
            createElement(LazyIcon, props)
        );

    return WrappedIcon;
};

/**
 * Get a Simple Icons (brand) icon component by name with lazy loading.
 */
export const getSimpleIcon = (iconName: string): IconComponent => {
    const cacheKey = `brand:${iconName}`;

    if (iconCache.has(cacheKey)) {
        return iconCache.get(cacheKey)!;
    }

    const LazyIcon = lazy(async () => {
        try {
            const siModule = await import('react-icons/si');
            const IconComponent = (siModule as unknown as Record<string, IconComponent>)[iconName];

            if (IconComponent) {
                iconCache.set(cacheKey, IconComponent);
                return { default: IconComponent };
            }
        } catch {
            // Silently fail
        }

        // Fallback to Lucide HelpCircle
        const { HelpCircle } = await import('lucide-react');
        return { default: HelpCircle };
    });

    const WrappedIcon: IconComponent = (props) =>
        createElement(Suspense, { fallback: createElement(IconFallback) },
            createElement(LazyIcon, props)
        );

    return WrappedIcon;
};

/**
 * Get either a Lucide or Simple icon based on the icon string format.
 * Brand icons are prefixed with "brand:" (e.g., "brand:SiNetflix")
 */
export const getIcon = (iconName: string): IconComponent => {
    if (iconName.startsWith('brand:')) {
        return getSimpleIcon(iconName.replace('brand:', ''));
    }
    return getLucideIcon(iconName);
};

// Common icons that should be loaded immediately (small subset for critical UI)
export {
    Plus,
    Trash2,
    Pencil,
    Search,
    X,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertTriangle,
    CheckCircle,
    Info,
    HelpCircle,
} from 'lucide-react';
