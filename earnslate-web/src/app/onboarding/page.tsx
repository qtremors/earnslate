'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Hand, Coins, Rocket, Wallet, LayoutDashboard, ArrowRightLeft, ClipboardList, RefreshCw } from 'lucide-react';
import styles from './page.module.css';

const steps = [
    { id: 1, title: 'Welcome', icon: Hand },
    { id: 2, title: 'Currency', icon: Coins },
    { id: 3, title: 'Get Started', icon: Rocket },
];

const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
    { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
    { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const updateSettings = useAppStore((state) => state.updateSettings);
    const completeOnboarding = useAppStore((state) => state.completeOnboarding);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCurrency, setSelectedCurrency] = useState('INR');

    const handleNext = () => {
        if (currentStep < steps.length) {
            // Save currency when moving past step 2
            if (currentStep === 2) {
                const currency = currencies.find(c => c.code === selectedCurrency);
                if (currency) {
                    updateSettings({
                        currency: currency.code,
                        currencySymbol: currency.symbol,
                        locale: currency.locale,
                    });
                }
            }
            setCurrentStep(currentStep + 1);
        } else {
            // Finish onboarding
            completeOnboarding();
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
                        <span className={styles.progressLabel}>
                            <step.icon size={16} className={styles.stepIconInline} />
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Content */}
            <Card className={styles.card}>
                {/* Step 1: Welcome */}
                {currentStep === 1 && (
                    <div className={styles.stepContent}>
                        <Wallet size={48} className={styles.stepIcon} />
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
                        <Coins size={48} className={styles.stepIcon} />
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
                        <Rocket size={48} className={styles.stepIcon} />
                        <h1 className={styles.stepTitle}>You&apos;re All Set!</h1>
                        <p className={styles.stepDescription}>
                            Your account is ready. Start by adding your first transaction or
                            setting up budgets for different categories.
                        </p>
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <LayoutDashboard size={20} /> Dashboard overview
                            </div>
                            <div className={styles.feature}>
                                <ArrowRightLeft size={20} /> Track transactions
                            </div>
                            <div className={styles.feature}>
                                <ClipboardList size={20} /> Manage budgets
                            </div>
                            <div className={styles.feature}>
                                <RefreshCw size={20} /> Monitor subscriptions
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className={styles.navigation}>
                    {currentStep > 1 && (
                        <Button variant="ghost" onClick={handleBack}>Back</Button>
                    )}
                    {currentStep === 1 && (
                        <Button variant="ghost" onClick={() => {
                            completeOnboarding();
                            router.push('/');
                        }}>
                            Skip
                        </Button>
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
