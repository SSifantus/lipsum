import type { Metadata } from "next";
import { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Footer, Header, ThemeProvider, Toaster } from "@/components";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Lipsum Pro",
  description: "Lorem Ipsum generator",
};

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
    <GoogleAnalytics gaId="G-"/>
    </html>
  );
}
