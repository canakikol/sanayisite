import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "@/styles/fonts.css";
import "@/styles/base.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteEffects from "@/components/SiteEffects";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { readContent } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await readContent();
  return {
    title: content.brand.siteTitle,
    description: content.brand.siteDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await readContent();

  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <SiteContentProvider content={content}>
          <SiteEffects />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SiteContentProvider>
      </body>
    </html>
  );
}
