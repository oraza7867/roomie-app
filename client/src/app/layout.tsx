import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { CAMPUS } from '@/lib/campus';

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `ROOMIE | Roommate & Room Finder for ${CAMPUS.name} (${CAMPUS.short})`,
  description: `Exclusive roommate and room finder for ${CAMPUS.name} (${CAMPUS.short}) students. Find compatible roommates and rooms near campus based on your living vibe.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-sans antialiased flex flex-col selection:bg-[#fbf2ec] selection:text-[#b4431e]">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
