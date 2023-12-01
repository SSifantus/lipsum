import "@/styles/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "Beat Manager";
const description = "An application for managing beat sheets.";

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL("https://beatmanager.vercel.app"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} h-screen w-screen`}>
        <div className="min-h-screen flex flex-col">
        <Toaster />
          <Header />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
