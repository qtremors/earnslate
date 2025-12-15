'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './page.module.css';

// ===== Onboarding Steps =====
const steps = [
    { id: 1, title: 'Welcome', icon: '👋' },
    { id: 2, title: 'Currency', icon: '💱' },
    { id: 3, title: 'Get Started', icon: '🚀' },
];

const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCurrency, setSelectedCurrency] = useState('INR');

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            router.push('/');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className={styles.onboarding}>
            {/* Progress Indicator */}
            <div className={styles.progress}>
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`${styles.progressStep} ${step.id <= currentStep ? styles.active : ''}`}
                    >
                        <span className={styles.progressDot}>{step.id < currentStep ? '✓' : step.id}</span>
                        <span className={styles.progressLabel}>{step.title}</span>
                    </div>
                ))}
            </div>

            {/* Content */}
            <Card className={styles.card}>
                {/* Step 1: Welcome */}
                {currentStep === 1 && (
                    <div className={styles.stepContent}>
                        <span className={styles.stepIcon}>💰</span>
                        <h1 className={styles.stepTitle}>Welcome to Earnslate</h1>
                        <p className={styles.stepDescription}>
                            Your personal finance manager. Track income, expenses, budgets,
                            and subscriptions all in one beautiful interface.
                        </p>
                    </div>
                )}

                {/* Step 2: Currency Selection */}
                {currentStep === 2 && (
                    <div className={styles.stepContent}>
                        <span className={styles.stepIcon}>💱</span>
                        <h1 className={styles.stepTitle}>Choose Your Currency</h1>
                        <p className={styles.stepDescription}>
                            Select your primary currency for displaying amounts.
                        </p>
                        <div className={styles.currencyGrid}>
                            {currencies.map((currency) => (
                                <button
                                    key={currency.code}
                                    className={`${styles.currencyOption} ${selectedCurrency === currency.code ? styles.selected : ''}`}
                                    onClick={() => setSelectedCurrency(currency.code)}
                                >
                                    <span className={styles.currencySymbol}>{currency.symbol}</span>
                                    <span className={styles.currencyName}>{currency.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Get Started */}
                {currentStep === 3 && (
                    <div className={styles.stepContent}>
                        <span className={styles.stepIcon}>🚀</span>
                        <h1 className={styles.stepTitle}>You&apos;re All Set!</h1>
                        <p className={styles.stepDescription}>
                            Your account is ready. Start by adding your first transaction or
                            setting up budgets for different categories.
                        </p>
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <span>📊</span> Dashboard overview
                            </div>
                            <div className={styles.feature}>
                                <span>💸</span> Track transactions
                            </div>
                            <div className={styles.feature}>
                                <span>📋</span> Manage budgets
                            </div>
                            <div className={styles.feature}>
                                <span>🔄</span> Monitor subscriptions
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className={styles.navigation}>
                    {currentStep > 1 && (
                        <Button variant="ghost" onClick={handleBack}>Back</Button>
                    )}
                    <div className={styles.spacer} />
                    <Button variant="primary" onClick={handleNext}>
                        {currentStep === steps.length ? 'Get Started' : 'Continue'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
