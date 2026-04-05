import { ReactNode, CSSProperties } from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'sm' | 'md' | 'lg';
    style?: CSSProperties;
}

export default function Card({
    children,
    className = '',
    hover = false,
    padding = 'md',
    style
}: CardProps) {
    return (
        <div
            className={`
        ${styles.card} 
        ${styles[`padding-${padding}`]} 
        ${hover ? styles.hover : ''} 
        ${className}
      `}
            style={style}
        >
            {children}
        </div>
    );
}

// ===== Card Header Sub-component =====
interface CardHeaderProps {
    title: string;
    action?: ReactNode;
}

export function CardHeader({ title, action }: CardHeaderProps) {
    return (
        <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{title}</h3>
            {action && <div className={styles.cardAction}>{action}</div>}
        </div>
    );
}
