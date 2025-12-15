'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input, { Select } from '@/components/Input';
import styles from './page.module.css';

const CURRENCIES = [
    { value: 'INR', label: '₹ Indian Rupee (INR)', symbol: '₹' },
    { value: 'USD', label: '$ US Dollar (USD)', symbol: '$' },
    { value: 'EUR', label: '€ Euro (EUR)', symbol: '€' },
    { value: 'GBP', label: '£ British Pound (GBP)', symbol: '£' },
];

const DATE_FORMATS = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2025)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2025)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2025-12-31)' },
];

export default function SettingsPage() {
    const settings = useAppStore((state) => state.settings);
    const updateSettings = useAppStore((state) => state.updateSettings);
    const clearAllData = useAppStore((state) => state.clearAllData);

    const [editModal, setEditModal] = useState<'name' | 'currency' | 'date' | null>(null);
    const [tempValue, setTempValue] = useState('');

    const openEditModal = (type: 'name' | 'currency' | 'date') => {
        if (type === 'name') setTempValue(settings.displayName);
        if (type === 'currency') setTempValue(settings.currency);
        if (type === 'date') setTempValue(settings.dateFormat);
        setEditModal(type);
    };

    const handleSave = () => {
        if (editModal === 'name') {
            updateSettings({ displayName: tempValue });
        } else if (editModal === 'currency') {
            const currency = CURRENCIES.find(c => c.value === tempValue);
            if (currency) {
                updateSettings({
                    currency: currency.value,
                    currencySymbol: currency.symbol,
                });
            }
        } else if (editModal === 'date') {
            updateSettings({ dateFormat: tempValue });
        }
        setEditModal(null);
    };

    const handleClearData = () => {
        if (confirm('Are you sure you want to delete ALL your data? This cannot be undone.')) {
            if (confirm('This will permanently delete all transactions, budgets, and subscriptions. Are you absolutely sure?')) {
                clearAllData();
            }
        }
    };

    return (
        <div className={styles.page}>
            <Header
                title="Settings"
                subtitle="Manage your preferences and account settings"
            />

            <div className={styles.content}>
                {/* Profile Section */}
                <Card className={styles.section}>
                    <CardHeader title="Profile" />
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Display Name</span>
                            <span className={styles.settingValue}>{settings.displayName}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal('name')}>Edit</Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Email</span>
                            <span className={styles.settingValue}>{settings.email || 'Not set'}</span>
                        </div>
                        <Button variant="ghost" size="sm" disabled>Edit</Button>
                    </div>
                </Card>

                {/* Preferences Section */}
                <Card className={styles.section}>
                    <CardHeader title="Preferences" />
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Currency</span>
                            <span className={styles.settingValue}>
                                {settings.currencySymbol} {CURRENCIES.find(c => c.value === settings.currency)?.label.split(' ').slice(1).join(' ') || settings.currency}
                            </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal('currency')}>Change</Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Date Format</span>
                            <span className={styles.settingValue}>{settings.dateFormat}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal('date')}>Change</Button>
                    </div>
                </Card>

                {/* Data Section */}
                <Card className={styles.section}>
                    <CardHeader title="Data Management" />
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Export Data</span>
                            <span className={styles.settingDesc}>Download all your data as JSON</span>
                        </div>
                        <Button variant="secondary" size="sm" disabled>Coming Soon</Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Clear All Data</span>
                            <span className={styles.settingDesc}>Permanently delete all your data</span>
                        </div>
                        <Button variant="danger" size="sm" onClick={handleClearData}>Clear Data</Button>
                    </div>
                </Card>

                {/* About Section */}
                <Card className={styles.section}>
                    <CardHeader title="About" />
                    <div className={styles.aboutInfo}>
                        <p><strong>Earnslate</strong> v0.1.0</p>
                        <p className={styles.aboutDesc}>Personal Finance Manager</p>
                    </div>
                </Card>
            </div>

            {/* Edit Name Modal */}
            <Modal isOpen={editModal === 'name'} onClose={() => setEditModal(null)} title="Edit Display Name" size="sm">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input
                        label="Display Name"
                        id="displayName"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Currency Modal */}
            <Modal isOpen={editModal === 'currency'} onClose={() => setEditModal(null)} title="Change Currency" size="sm">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Select
                        label="Currency"
                        id="currency"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        options={CURRENCIES.map(c => ({ value: c.value, label: c.label }))}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Date Format Modal */}
            <Modal isOpen={editModal === 'date'} onClose={() => setEditModal(null)} title="Change Date Format" size="sm">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Select
                        label="Date Format"
                        id="dateFormat"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        options={DATE_FORMATS}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
