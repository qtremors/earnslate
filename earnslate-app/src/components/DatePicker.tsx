'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import styles from './DatePicker.module.css';

interface DatePickerProps {
    value: string; // YYYY-MM-DD format
    onChange: (date: string) => void;
    label?: string;
    id?: string;
    required?: boolean;
    min?: string;
    max?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DatePicker({
    value,
    onChange,
    label,
    id,
    required,
    min,
    max
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        const date = value ? new Date(value) : new Date();
        return { year: date.getFullYear(), month: date.getMonth() };
    });
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Parse the current value
    const selectedDate = value ? new Date(value) : null;

    // Calculate dropdown position when opening
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday)
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    // Navigate months
    const prevMonth = () => {
        setViewDate(prev => {
            if (prev.month === 0) {
                return { year: prev.year - 1, month: 11 };
            }
            return { ...prev, month: prev.month - 1 };
        });
    };

    const nextMonth = () => {
        setViewDate(prev => {
            if (prev.month === 11) {
                return { year: prev.year + 1, month: 0 };
            }
            return { ...prev, month: prev.month + 1 };
        });
    };

    // Select date
    const handleDateClick = (day: number) => {
        const date = new Date(viewDate.year, viewDate.month, day);
        const dateStr = date.toISOString().split('T')[0];

        // Check min/max bounds
        if (min && dateStr < min) return;
        if (max && dateStr > max) return;

        onChange(dateStr);
        setIsOpen(false);
    };

    // Check if date is disabled
    const isDateDisabled = (day: number) => {
        const dateStr = new Date(viewDate.year, viewDate.month, day).toISOString().split('T')[0];
        if (min && dateStr < min) return true;
        if (max && dateStr > max) return true;
        return false;
    };

    // Check if date is selected
    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getFullYear() === viewDate.year &&
            selectedDate.getMonth() === viewDate.month &&
            selectedDate.getDate() === day
        );
    };

    // Check if date is today
    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getFullYear() === viewDate.year &&
            today.getMonth() === viewDate.month &&
            today.getDate() === day
        );
    };

    // Format display value
    const formatDisplayDate = () => {
        if (!selectedDate) return '';
        return selectedDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Generate calendar grid
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
        const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const disabled = isDateDisabled(day);
            const selected = isSelected(day);
            const today = isToday(day);

            days.push(
                <button
                    key={day}
                    type="button"
                    className={`${styles.day} ${selected ? styles.selected : ''} ${today ? styles.today : ''} ${disabled ? styles.disabled : ''}`}
                    onClick={() => handleDateClick(day)}
                    disabled={disabled}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    return (
        <div className={styles.container} ref={containerRef}>
            {label && (
                <label className={styles.label} htmlFor={id}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <button
                ref={triggerRef}
                type="button"
                id={id}
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <span className={styles.value}>
                    {formatDisplayDate() || 'Select date'}
                </span>
                <Calendar size={18} className={styles.icon} />
            </button>

            {isOpen && (
                <div
                    className={styles.dropdown}
                    role="dialog"
                    aria-label="Choose date"
                    style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                >
                    <div className={styles.header}>
                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={prevMonth}
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className={styles.monthYear}>
                            {MONTHS[viewDate.month]} {viewDate.year}
                        </span>
                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={nextMonth}
                            aria-label="Next month"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className={styles.weekdays}>
                        {DAYS.map(day => (
                            <div key={day} className={styles.weekday}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className={styles.grid}>
                        {renderCalendar()}
                    </div>
                </div>
            )}
        </div>
    );
}
