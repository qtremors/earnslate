import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
}

const SPINNER_SIZES = { sm: 14, md: 16, lg: 20 };

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const spinnerSize = SPINNER_SIZES[size];

    return (
        <button
            className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ''}
        ${loading ? styles.loading : ''}
        ${className}
      `}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 size={spinnerSize} className={styles.spinner} />}
            <span className={loading ? styles.hiddenText : ''}>{children}</span>
        </button>
    );
}

