import type { Metadata } from "next";
import { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Footer, Header, ThemeProvider, Toaster } from "@/components";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title:  "Lipsum Fast",
  description: "A Lorem Ipsum generator",
  metadataBase: new URL("https://lipsum.fast"),
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: "Lipsum Fast",
    description: "A Lorem Ipsum generator",
    url: "https://lipsum.fast",
    siteName: "Lipsum Fast",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Lipsum Fast",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: ReactNode;
}>){
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className="min-h-screen bg-background font-sans antialiased"
    >
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Toaster/>
      <Header/>
      {children}
      <Footer/>
    </ThemeProvider>
    </body>
    <GoogleAnalytics gaId="G-7QY7WTV5N8"/>
    </html>
  );
}
