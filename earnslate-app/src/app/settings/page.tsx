import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function SettingsPage() {
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
                            <span className={styles.settingValue}>User</span>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Email</span>
                            <span className={styles.settingValue}>user@example.com</span>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                </Card>

                {/* Preferences Section */}
                <Card className={styles.section}>
                    <CardHeader title="Preferences" />
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Currency</span>
                            <span className={styles.settingValue}>₹ Indian Rupee (INR)</span>
                        </div>
                        <Button variant="ghost" size="sm">Change</Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Date Format</span>
                            <span className={styles.settingValue}>DD/MM/YYYY</span>
                        </div>
                        <Button variant="ghost" size="sm">Change</Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>First Day of Week</span>
                            <span className={styles.settingValue}>Monday</span>
                        </div>
                        <Button variant="ghost" size="sm">Change</Button>
                    </div>
                </Card>

                {/* Data Section */}
                <Card className={styles.section}>
                    <CardHeader title="Data Management" />
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Export Data</span>
                            <span className={styles.settingDesc}>Download all your data as CSV</span>
                        </div>
                        <Button variant="secondary" size="sm">Export</Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Import Data</span>
                            <span className={styles.settingDesc}>Import transactions from CSV</span>
                        </div>
                        <Button variant="secondary" size="sm">Import</Button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>Clear All Data</span>
                            <span className={styles.settingDesc}>Permanently delete all your data</span>
                        </div>
                        <Button variant="danger" size="sm">Clear Data</Button>
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
        </div>
    );
}
