import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div className={styles.inputGroup}>
                {label && (
                    <label className={styles.label} htmlFor={props.id}>
                        {label}
                    </label>
                )}
                <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <input
                        ref={ref}
                        className={`${styles.input} ${icon ? styles.hasIcon : ''} ${className}`}
                        {...props}
                    />
                </div>
                {error && <span className={styles.error}>{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;

// ===== Select Component =====
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', ...props }, ref) => {
        return (
            <div className={styles.inputGroup}>
                {label && (
                    <label className={styles.label} htmlFor={props.id}>
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`${styles.select} ${error ? styles.hasError : ''} ${className}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <span className={styles.error}>{error}</span>}
            </div>
        );
    }
);

Select.displayName = 'Select';
