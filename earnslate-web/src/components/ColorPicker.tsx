'use client';

import { COLOR_OPTIONS } from '@/types';
import styles from './ColorPicker.module.css';

interface ColorPickerProps {
    value: string | null;
    onChange: (color: string) => void;
    label?: string;
}

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}

            <div className={styles.grid}>
                {COLOR_OPTIONS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        className={`${styles.colorButton} ${value === color ? styles.selected : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onChange(color)}
                        title={color}
                    >
                        {value === color && (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7L5.5 10.5L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
