import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import '../styles/globals.css';

export const metadata: Metadata = {
    title: {
        template: '%s | Lipso',
        default: 'Lorem Ipsum Generator'
    }
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased">
                        <main className="grow">{children}</main>

            </body>
        </html>
    );
}
