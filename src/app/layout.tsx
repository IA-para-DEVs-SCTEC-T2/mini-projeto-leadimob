import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadImobi",
  description: "Qualificação inteligente de leads imobiliários",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-leadimobi-gradient min-h-screen">
        {children}
      </body>
    </html>
  );
}
