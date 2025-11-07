import { Header } from "@/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lipsum Pro",
  description: "Lorem Ipsum generator",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
    <body
      className={`min-h-screen bg-background font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}
    >
    <Header/>
    {children}
    </body>
    </html>
  );
}
