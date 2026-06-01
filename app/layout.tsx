import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cedro Adventures Management Platfrom",
  description: "Management tool for the company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${googleSans.variable} h-full antialiased`}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Cedro Adventures" />
      </head>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
