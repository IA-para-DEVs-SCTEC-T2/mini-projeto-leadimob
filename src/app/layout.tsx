import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
