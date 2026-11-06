import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import Navbar from "@/components/navbar/Navbar";
import CreatedPostsProvider from "@/components/posts/CreatedPostsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hub | HAKYE",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body>
        <AuthProvider>
          <CreatedPostsProvider>
            <Navbar />
            {children}
          </CreatedPostsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
