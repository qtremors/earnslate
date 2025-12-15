import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StoreProvider from '@/components/StoreProvider';
import { ToastProvider } from '@/components/Toast';
import Sidebar from '@/components/Sidebar';
import './globals.css';
import styles from './layout.module.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Earnslate - Personal Finance Manager',
  description: 'Track your income, expenses, budgets, and subscriptions with a premium monochrome interface.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <StoreProvider>
          <ToastProvider>
            <div className={styles.appContainer}>
              <Sidebar />
              <main className={styles.mainContent}>
                {children}
              </main>
            </div>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

