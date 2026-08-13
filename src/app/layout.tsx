import type { Metadata } from "next";
import { Karla, Young_Serif } from "next/font/google";
import "./globals.css";

const display = Young_Serif({
  variable: "--font-family-display",
  subsets: ["latin"],
  weight: "400",
});

const sans = Karla({
  variable: "--font-family-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://plate-and-palate-nortelab-projects.vercel.app"),
  title: {
    default: "Plate & Palate | Food made close to home",
    template: "%s | Plate & Palate",
  },
  description: "Discover homemade dishes from cooks in your neighborhood.",
  openGraph: {
    title: "Plate & Palate",
    description: "Homemade dishes from cooks in your neighborhood.",
    type: "website",
    url: "https://plate-and-palate-nortelab-projects.vercel.app",
    siteName: "Plate & Palate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {children}
    </body>
    </html>
  );
}
