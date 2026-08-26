import type { Metadata, Viewport } from "next";
import "./globals.css";

const FRASE_PUBLICA =
  "Oportunidades que circulam por indicação nas melhores faculdades do Brasil — reunidas num lugar só.";

export const metadata: Metadata = {
  title: {
    default: "Indica — oportunidades que circulam por indicação",
    template: "%s · Indica",
  },
  description: FRASE_PUBLICA,
  openGraph: {
    title: "Indica",
    description: FRASE_PUBLICA,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#100f0d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
