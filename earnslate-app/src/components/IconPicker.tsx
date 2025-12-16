'use client';

import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import styles from './IconPicker.module.css';

// All available Lucide icons (curated list for performance)
const LUCIDE_ICONS = [
    // Finance
    { name: 'Wallet', label: 'Wallet' },
    { name: 'CreditCard', label: 'Credit Card' },
    { name: 'Banknote', label: 'Cash' },
    { name: 'PiggyBank', label: 'Piggy Bank' },
    { name: 'DollarSign', label: 'Dollar' },
    { name: 'TrendingUp', label: 'Trending Up' },
    { name: 'TrendingDown', label: 'Trending Down' },
    { name: 'Receipt', label: 'Receipt' },
    // Streaming & Entertainment
    { name: 'Tv', label: 'TV' },
    { name: 'Film', label: 'Film' },
    { name: 'Clapperboard', label: 'Movie' },
    { name: 'Video', label: 'Video' },
    { name: 'Music', label: 'Music' },
    { name: 'Headphones', label: 'Headphones' },
    { name: 'Radio', label: 'Radio' },
    { name: 'Mic', label: 'Microphone' },
    // Gaming
    { name: 'Gamepad2', label: 'Gaming' },
    { name: 'Joystick', label: 'Joystick' },
    { name: 'Trophy', label: 'Trophy' },
    { name: 'Sword', label: 'Sword' },
    // Tech & Cloud
    { name: 'Cloud', label: 'Cloud' },
    { name: 'Server', label: 'Server' },
    { name: 'Database', label: 'Database' },
    { name: 'HardDrive', label: 'Storage' },
    { name: 'Laptop', label: 'Laptop' },
    { name: 'Smartphone', label: 'Phone' },
    { name: 'Tablet', label: 'Tablet' },
    { name: 'Monitor', label: 'Monitor' },
    { name: 'Wifi', label: 'WiFi' },
    { name: 'Globe', label: 'Web' },
    // Communication
    { name: 'Mail', label: 'Email' },
    { name: 'MessageCircle', label: 'Message' },
    { name: 'PhoneCall', label: 'Phone Call' },
    // Shopping & Food
    { name: 'ShoppingCart', label: 'Shopping' },
    { name: 'ShoppingBag', label: 'Bag' },
    { name: 'Store', label: 'Store' },
    { name: 'Package', label: 'Package' },
    { name: 'UtensilsCrossed', label: 'Food' },
    { name: 'Coffee', label: 'Coffee' },
    { name: 'Wine', label: 'Drinks' },
    { name: 'Pizza', label: 'Pizza' },
    { name: 'Apple', label: 'Apple' },
    // Transport
    { name: 'Car', label: 'Car' },
    { name: 'Bike', label: 'Bike' },
    { name: 'Bus', label: 'Bus' },
    { name: 'Train', label: 'Train' },
    { name: 'Plane', label: 'Plane' },
    { name: 'Ship', label: 'Ship' },
    { name: 'Fuel', label: 'Fuel' },
    // Home & Utilities
    { name: 'Home', label: 'Home' },
    { name: 'Building', label: 'Building' },
    { name: 'Building2', label: 'Office' },
    { name: 'Lightbulb', label: 'Electricity' },
    { name: 'Flame', label: 'Gas' },
    { name: 'Droplet', label: 'Water' },
    { name: 'Thermometer', label: 'Temperature' },
    { name: 'Wind', label: 'Air' },
    // Health & Fitness
    { name: 'Heart', label: 'Health' },
    { name: 'HeartPulse', label: 'Heartbeat' },
    { name: 'Dumbbell', label: 'Gym' },
    { name: 'PersonStanding', label: 'Exercise' },
    { name: 'Footprints', label: 'Walking' },
    { name: 'Pill', label: 'Medicine' },
    { name: 'Stethoscope', label: 'Doctor' },
    { name: 'Brain', label: 'Mental' },
    // Education & Work
    { name: 'BookOpen', label: 'Book' },
    { name: 'GraduationCap', label: 'Education' },
    { name: 'Library', label: 'Library' },
    { name: 'Newspaper', label: 'News' },
    { name: 'FileText', label: 'Document' },
    { name: 'Briefcase', label: 'Work' },
    { name: 'Calendar', label: 'Calendar' },
    { name: 'Clock', label: 'Time' },
    // Security
    { name: 'Shield', label: 'Security' },
    { name: 'Lock', label: 'Lock' },
    { name: 'Key', label: 'Key' },
    { name: 'Eye', label: 'View' },
    { name: 'EyeOff', label: 'Hidden' },
    // Family & Pets
    { name: 'Baby', label: 'Baby' },
    { name: 'Users', label: 'Family' },
    { name: 'Dog', label: 'Pet' },
    { name: 'Cat', label: 'Cat' },
    { name: 'Paw', label: 'Paw' },
    // Nature & Travel
    { name: 'Sun', label: 'Sun' },
    { name: 'Moon', label: 'Moon' },
    { name: 'Star', label: 'Star' },
    { name: 'Mountain', label: 'Mountain' },
    { name: 'TreePine', label: 'Tree' },
    { name: 'Flower', label: 'Flower' },
    { name: 'Umbrella', label: 'Umbrella' },
    { name: 'Map', label: 'Map' },
    { name: 'Compass', label: 'Compass' },
    // General
    { name: 'Gift', label: 'Gift' },
    { name: 'PartyPopper', label: 'Party' },
    { name: 'Camera', label: 'Camera' },
    { name: 'Image', label: 'Image' },
    { name: 'Tag', label: 'Tag' },
    { name: 'Bookmark', label: 'Bookmark' },
    { name: 'Flag', label: 'Flag' },
    { name: 'Bell', label: 'Notification' },
    { name: 'Settings', label: 'Settings' },
    { name: 'Sparkles', label: 'Sparkle' },
    { name: 'Zap', label: 'Flash' },
    { name: 'Plus', label: 'Plus' },
    { name: 'Minus', label: 'Minus' },
    { name: 'Check', label: 'Check' },
    { name: 'X', label: 'Close' },
    { name: 'HelpCircle', label: 'Help' },
    { name: 'Info', label: 'Info' },
    { name: 'AlertTriangle', label: 'Warning' },
];

interface IconPickerProps {
    value: string;
    onChange: (icon: string) => void;
    label?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function IconPicker({ value, onChange, label, isOpen: controlledIsOpen, onOpenChange }: IconPickerProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Support both controlled and uncontrolled modes
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = (open: boolean) => {
        if (onOpenChange) {
            onOpenChange(open);
        } else {
            setInternalIsOpen(open);
        }
    };

    // Get the current icon component
    const CurrentIcon = (LucideIcons as unknown as Record<string, React.ElementType>)[value] || LucideIcons.HelpCircle;

    const filteredIcons = useMemo(() => {
        if (!search.trim()) return LUCIDE_ICONS;
        const q = search.toLowerCase().trim();
        return LUCIDE_ICONS.filter(i =>
            i.name.toLowerCase().includes(q) ||
            i.label.toLowerCase().includes(q)
        );
    }, [search]);

    const currentLabel = LUCIDE_ICONS.find(i => i.name === value)?.label || 'Select Icon';

    // If controlled from outside (no trigger button shown), just render the dropdown portion
    const showTrigger = controlledIsOpen === undefined;

    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}

            {showTrigger && (
                <button
                    type="button"
                    className={styles.trigger}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <CurrentIcon size={20} />
                    <span>{currentLabel}</span>
                    <LucideIcons.ChevronDown size={16} className={styles.chevron} />
                </button>
            )}

            {isOpen && (
                <>
                    <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
                    <div className={styles.dropdown}>
                        {/* Search input */}
                        <div className={styles.searchBox}>
                            <LucideIcons.Search size={16} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search icons..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={styles.searchInput}
                                autoFocus
                            />
                        </div>

                        <div className={styles.grid}>
                            {filteredIcons.map((icon) => {
                                const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[icon.name];
                                if (!Icon) return null;

                                return (
                                    <button
                                        key={icon.name}
                                        type="button"
                                        className={`${styles.iconButton} ${value === icon.name ? styles.selected : ''}`}
                                        onClick={() => {
                                            onChange(icon.name);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        title={icon.label}
                                    >
                                        <Icon size={20} />
                                    </button>
                                );
                            })}
                        </div>

                        {filteredIcons.length === 0 && (
                            <div className={styles.noResults}>
                                No icons found for "{search}"
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export { LUCIDE_ICONS };
