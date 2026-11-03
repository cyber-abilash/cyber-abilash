import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClassifiedLoader from "@/components/classified-loader";
import { SmoothScrollProvider } from "@/lib/motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://cyber-abilash.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "CYBER ABILASH | Cybersecurity Portfolio",
    template: "%s | CYBER ABILASH",
  },

  description:
    "Explore Abilash S's cybersecurity portfolio, ethical hacking journey, Kali Linux learning, technical skills and projects.",

  applicationName: "CYBER ABILASH",

  keywords: [
    "Abilash S",
    "Cybersecurity",
    "Ethical Hacking",
    "Kali Linux",
    "Cybersecurity Portfolio",
    "Web Development",
    "Networking",
    "Security Projects",
  ],

  authors: [{ name: "Abilash S" }],
  creator: "Abilash S",
  publisher: "CYBER ABILASH",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "CYBER ABILASH | Cybersecurity Portfolio",
    description:
      "Think Beyond. Build Secure. Explore my cybersecurity journey, skills and projects.",
    url: siteUrl,
    siteName: "CYBER ABILASH",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CYBER ABILASH | Cybersecurity Portfolio",
    description:
      "Cybersecurity • Ethical Hacking • Technology • Projects",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080508",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ClassifiedLoader />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
