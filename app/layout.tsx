import type {Metadata} from "next";
import {ReactNode} from "react";
import {GoogleAnalytics} from "@next/third-parties/google";
import {Footer, Header, ThemeProvider, Toaster} from "@/components";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Lipsum Fast",
  description: "Lipsum Fast is a super fast, free, easy to use, Lorem Ipsum generator that helps you create placeholder text with a minimal amount of effort.",
  metadataBase: new URL("https://lipsum.fast"),
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Lipsum Fast",
    description: "Lipsum Fast is a super fast, free, easy to use, Lorem Ipsum generator that helps you create placeholder text with a minimal amount of effort.",
    url: "https://lipsum.fast",
    siteName: "Lipsum Fast",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lipsum Fast",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Lipsum Fast",
  "description": "Lipsum Fast is a super fast, free, easy to use, Lorem Ipsum generator that helps you create placeholder text with a minimal amount of effort.",
  "url": "https://lipsum.fast",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Lipsum Fast",
  "url": "https://lipsum.fast",
  "description": "Lipsum Fast is a super fast, free, easy to use, Lorem Ipsum generator that helps you create placeholder text with a minimal amount of effort.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-background font-sans antialiased"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(websiteStructuredData)}}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-7QY7WTV5N8" />
    </html>
  );
}
