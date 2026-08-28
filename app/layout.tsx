import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'SpendFlow | Full-Stack Personal Expense & Financial Tracker',
  description: 'Manage personal expenses, track monthly cashflows, configure category budget caps, and generate financial reports.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <PreferencesProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" theme="dark" richColors />
          </AuthProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
