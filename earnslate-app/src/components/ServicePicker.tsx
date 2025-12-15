'use client';

import { useState, useMemo } from 'react';
import { POPULAR_SERVICES, SERVICE_CATEGORIES, ServiceTemplate } from '@/data/services';
import * as LucideIcons from 'lucide-react';
import * as SimpleIcons from 'react-icons/si';
import styles from './ServicePicker.module.css';

interface ServicePickerProps {
    onSelect: (service: ServiceTemplate) => void;
    onCustom: () => void;
}

export default function ServicePicker({ onSelect, onCustom }: ServicePickerProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredServices = useMemo(() => {
        let services = POPULAR_SERVICES;

        if (selectedCategory) {
            services = services.filter(s => s.category === selectedCategory);
        }

        if (search.trim()) {
            const q = search.toLowerCase().trim();
            services = services.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.category.toLowerCase().includes(q)
            );
        }

        return services;
    }, [search, selectedCategory]);

    const getIcon = (service: ServiceTemplate) => {
        if (service.iconType === 'brand') {
            const Icon = (SimpleIcons as unknown as Record<string, React.ElementType>)[service.icon];
            return Icon ? <Icon size={20} /> : <LucideIcons.HelpCircle size={20} />;
        }
        const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[service.icon];
        return Icon ? <Icon size={20} /> : <LucideIcons.HelpCircle size={20} />;
    };

    return (
        <div className={styles.container}>
            {/* Search */}
            <div className={styles.searchBox}>
                <LucideIcons.Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                    autoFocus
                />
            </div>

            {/* Categories */}
            <div className={styles.categories}>
                <button
                    className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(null)}
                >
                    All
                </button>
                {SERVICE_CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`${styles.categoryButton} ${selectedCategory === cat ? styles.active : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Services Grid */}
            <div className={styles.servicesGrid}>
                {filteredServices.map((service) => (
                    <button
                        key={service.name}
                        className={styles.serviceCard}
                        onClick={() => onSelect(service)}
                    >
                        <div
                            className={styles.serviceIcon}
                            style={{ backgroundColor: `${service.color}20`, color: service.color }}
                        >
                            {getIcon(service)}
                        </div>
                        <span className={styles.serviceName}>{service.name}</span>
                    </button>
                ))}

                {/* Custom option at end */}
                <button
                    className={`${styles.serviceCard} ${styles.customCard}`}
                    onClick={onCustom}
                >
                    <div className={styles.serviceIcon}>
                        <LucideIcons.Plus size={20} />
                    </div>
                    <span className={styles.serviceName}>Custom</span>
                </button>
            </div>

            {filteredServices.length === 0 && (
                <div className={styles.noResults}>
                    <p>No services found for "{search}"</p>
                    <button className={styles.customButton} onClick={onCustom}>
                        <LucideIcons.Plus size={16} />
                        Add Custom Subscription
                    </button>
                </div>
            )}
        </div>
    );
}
