import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { DemoBanner } from '@/components/layout/DemoBanner';

export const metadata: Metadata = {
  title: 'Our Space — Startup Ecosystem Network',
  description: "Unlock your space. Find people, places, and resources to build. Don't ask who you know. Ask what you need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col antialiased selection:bg-teal-500 selection:text-white">
        <AuthProvider>
          <DemoBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
