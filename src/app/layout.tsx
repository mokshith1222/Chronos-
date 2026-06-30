import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SchemaMarkup } from "@/components/seo/schema-markup";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Chronos | Advanced Productivity & Time Tracking",
    template: "%s | Chronos"
  },
  description: "Chronos is an enterprise-grade time tracking, task management, and productivity analytics platform designed for high-performance teams.",
  metadataBase: new URL("https://chronos-lime-six.vercel.app"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Chronos | Advanced Productivity & Time Tracking",
    description: "Enterprise-grade time tracking, task management, and productivity analytics.",
    url: "https://chronos-lime-six.vercel.app",
    siteName: "Chronos",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronos | Advanced Productivity & Time Tracking",
    description: "Enterprise-grade time tracking, task management, and productivity analytics."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geist.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <SchemaMarkup />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "aurora", "ocean", "sunset", "forest", "lavender", "midnight", "glass"]}
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

