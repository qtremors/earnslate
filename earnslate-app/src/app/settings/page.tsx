'use client';

import { useState, useRef } from 'react';
import { useAppStore, useShallow } from '@/store';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/components/Toast';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input, { Select } from '@/components/Input';
import { Download, Upload, Plus, Trash2, Tag, Moon, Sun, Monitor } from 'lucide-react';
import styles from './page.module.css';
import packageJson from '../../../package.json';

const APP_VERSION = packageJson.version;

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

const LOCALES = [
    { value: 'en-IN', label: 'Indian (1,00,000)' },
    { value: 'en-US', label: 'US/International (100,000)' },
    { value: 'de-DE', label: 'European (100.000)' },
];

export default function SettingsPage() {
    // Use shallow comparison to avoid re-renders when other store parts change
    const { settings, transactions, budgets, subscriptions, updateSettings, clearAllData, importData } = useAppStore(
        useShallow((state) => ({
            settings: state.settings,
            transactions: state.transactions,
            budgets: state.budgets,
            subscriptions: state.subscriptions,
            updateSettings: state.updateSettings,
            clearAllData: state.clearAllData,
            importData: state.importData,
        }))
    );
    const { confirm, ConfirmDialog } = useConfirm();
    const { showToast } = useToast();

    const [editModal, setEditModal] = useState<'name' | 'currency' | 'date' | 'locale' | 'category' | null>(null);
    const [tempValue, setTempValue] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openEditModal = (type: 'name' | 'currency' | 'date' | 'locale' | 'category') => {
        if (type === 'name') setTempValue(settings.displayName);
        if (type === 'currency') setTempValue(settings.currency);
        if (type === 'date') setTempValue(settings.dateFormat);
        if (type === 'locale') setTempValue(settings.locale || 'en-IN');
        setEditModal(type);
    };

    const handleSave = () => {
        if (editModal === 'name') {
            updateSettings({ displayName: tempValue });
        } else if (editModal === 'currency') {
            const currency = CURRENCIES.find(c => c.value === tempValue);
            if (currency) {
                updateSettings({ currency: currency.value, currencySymbol: currency.symbol });
            }
        } else if (editModal === 'date') {
            updateSettings({ dateFormat: tempValue });
        } else if (editModal === 'locale') {
            updateSettings({ locale: tempValue });
        }
        setEditModal(null);
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            const exists = settings.customCategories.some(c => c.name.toLowerCase() === newCategory.trim().toLowerCase());
            if (!exists) {
                const newCat = {
                    id: crypto.randomUUID(),
                    name: newCategory.trim(),
                    icon: 'Tag',
                    color: '#64748B',
                    type: 'both' as const,
                };
                updateSettings({ customCategories: [...settings.customCategories, newCat] });
                setNewCategory('');
            }
        }
    };

    const handleDeleteCategory = (catId: string) => {
        if (settings.customCategories.length > 1) {
            updateSettings({ customCategories: settings.customCategories.filter(c => c.id !== catId) });
        }
    };

    const handleExportData = () => {
        const data = {
            version: APP_VERSION,
            exportDate: new Date().toISOString(),
            settings,
            transactions,
            budgets,
            subscriptions,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `earnslate_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                const counts = `${data.transactions?.length || 0} transactions, ${data.budgets?.length || 0} budgets, ${data.subscriptions?.length || 0} subscriptions`;

                const confirmed = await confirm({
                    title: 'Import Backup',
                    message: `Import backup with ${counts}? This will replace your current data.`,
                    confirmText: 'Import',
                    variant: 'warning',
                });

                if (confirmed) {
                    // Import directly - importData handles the merge/replace
                    importData({
                        settings: data.settings,
                        transactions: data.transactions || [],
                        budgets: data.budgets || [],
                        subscriptions: data.subscriptions || [],
                    });
                    showToast('Data imported successfully', 'success');
                }
            } catch {
                showToast('Invalid backup file', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleClearData = async () => {
        const confirmed = await confirm({
            title: 'Clear All Data',
            message: 'Are you sure you want to delete ALL your data? This action cannot be undone.',
            confirmText: 'Delete Everything',
            variant: 'danger',
        });

        if (confirmed) {
            clearAllData();
        }
    };

    return (
        <div className={styles.page}>
            <Header title="Settings" subtitle="Manage your preferences and account settings" />

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
                </Card>

                {/* Categories Section */}
                <Card className={styles.section}>
                    <CardHeader title="Categories" />
                    <div className={styles.categoryList}>
                        {settings.customCategories.map((cat) => (
                            <div key={cat.id} className={styles.categoryItem}>
                                <Tag size={14} />
                                <span>{cat.name}</span>
                                {settings.customCategories.length > 1 && (
                                    <button
                                        className={styles.deleteCategory}
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        aria-label={`Delete ${cat.name} category`}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={styles.addCategory}>
                        <input
                            type="text"
                            placeholder="New category..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                            className={styles.categoryInput}
                        />
                        <Button variant="secondary" size="sm" onClick={handleAddCategory}>
                            <Plus size={16} />
                            Add
                        </Button>
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
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Number Format</span>
                            <span className={styles.settingValue}>
                                {LOCALES.find(l => l.value === settings.locale)?.label || 'Indian (1,00,000)'}
                            </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal('locale')}>Change</Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Theme</span>
                            <span className={styles.settingValue}>
                                {settings.theme === 'dark' ? 'Dark' : settings.theme === 'light' ? 'Light' : 'System'}
                            </span>
                        </div>
                        <div className={styles.themeToggle}>
                            <button
                                className={`${styles.themeButton} ${settings.theme === 'dark' ? styles.active : ''}`}
                                onClick={() => updateSettings({ theme: 'dark' })}
                                title="Dark theme"
                            >
                                <Moon size={16} />
                            </button>
                            <button
                                className={`${styles.themeButton} ${settings.theme === 'light' ? styles.active : ''}`}
                                onClick={() => updateSettings({ theme: 'light' })}
                                title="Light theme"
                            >
                                <Sun size={16} />
                            </button>
                            <button
                                className={`${styles.themeButton} ${settings.theme === 'system' ? styles.active : ''}`}
                                onClick={() => updateSettings({ theme: 'system' })}
                                title="System preference"
                            >
                                <Monitor size={16} />
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Data Section */}
                <Card className={styles.section}>
                    <CardHeader title="Data Management" />
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Export Data</span>
                            <span className={styles.settingDesc}>Download all your data as JSON backup</span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleExportData}>
                            <Download size={16} />
                            Export
                        </Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Import Data</span>
                            <span className={styles.settingDesc}>Restore from a JSON backup file</span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                            <Upload size={16} />
                            Import
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            style={{ display: 'none' }}
                        />
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
                        <p><strong>Earnslate</strong> v{APP_VERSION}</p>
                        <p className={styles.aboutDesc}>Personal Finance Manager with God-Tier Customization</p>
                    </div>
                </Card>
            </div>

            {/* Edit Name Modal */}
            <Modal isOpen={editModal === 'name'} onClose={() => setEditModal(null)} title="Edit Display Name" size="sm">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input label="Display Name" id="displayName" value={tempValue} onChange={(e) => setTempValue(e.target.value)} placeholder="Enter your name" required />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Currency Modal */}
            <Modal isOpen={editModal === 'currency'} onClose={() => setEditModal(null)} title="Change Currency" size="sm">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Select label="Currency" id="currency" value={tempValue} onChange={(e) => setTempValue(e.target.value)} options={CURRENCIES.map(c => ({ value: c.value, label: c.label }))} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Date Format Modal */}
            <Modal isOpen={editModal === 'date'} onClose={() => setEditModal(null)} title="Change Date Format" size="sm">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Select label="Date Format" id="dateFormat" value={tempValue} onChange={(e) => setTempValue(e.target.value)} options={DATE_FORMATS} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Locale Modal */}
            <Modal isOpen={editModal === 'locale'} onClose={() => setEditModal(null)} title="Change Number Format" size="sm">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Select label="Number Format" id="locale" value={tempValue} onChange={(e) => setTempValue(e.target.value)} options={LOCALES} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog />
        </div>
    );
}
