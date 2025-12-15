import styles from './Header.module.css';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.titleSection}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>

            <div className={styles.actions}>
                {/* User avatar placeholder */}
                <div className={styles.avatar}>
                    <span>👤</span>
                </div>
            </div>
        </header>
    );
}
