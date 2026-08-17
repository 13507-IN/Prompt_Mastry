import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Prompt Mastery - Create Perfect AI Prompts",
  description: "Generate professional, copy-paste-ready prompts for your projects. Answer simple questions and get AI-powered recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authUrl = process.env.NEXT_PUBLIC_RISHIRAJ_AUTH_URL || 'https://rishiraj-auth.onrender.com';

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <link
          rel="stylesheet"
          href={`${authUrl}/sdk/rishiraj-auth-modal.css`}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-200 selection:text-sky-900">
        <Script
          src={`${authUrl}/sdk/rishiraj-auth.js`}
          strategy="beforeInteractive"
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
