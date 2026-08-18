import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    value: number; // 0-100
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    showLabel?: boolean;
    size?: 'sm' | 'md';
}

export default function ProgressBar({
    value,
    max = 100,
    variant = 'default',
    showLabel = false,
    size = 'md',
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    // Auto-determine variant based on percentage if default
    const autoVariant = variant === 'default'
        ? percentage >= 90 ? 'danger' : percentage >= 75 ? 'warning' : 'success'
        : variant;

    return (
        <div className={styles.container}>
            <div className={`${styles.track} ${styles[size]}`}>
                <div
                    className={`${styles.fill} ${styles[autoVariant]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <span className={styles.label}>{Math.round(percentage)}%</span>
            )}
        </div>
    );
}
