import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import Navbar from "@/components/navbar/Navbar";
import CreatedPostsProvider from "@/components/posts/CreatedPostsProvider";
import SavePostProvider from "@/components/save/SavePostProvider";

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

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
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
            <SavePostProvider>
              <Navbar />
              {children}
            </SavePostProvider>
          </CreatedPostsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
