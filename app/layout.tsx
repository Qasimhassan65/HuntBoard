import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import { AddJobModal } from "@/components/AddJobModal";
import JobDrawer from "@/components/JobDrawer";
import { AddContactModal } from "@/components/AddContactModal";
import { ContactDrawer } from "@/components/ContactDrawer";
import { SaveProgressModal } from "@/components/SaveProgressModal";
import { AuthModal } from "@/components/AuthModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HuntBoard",
  description: "Professional job application tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className={`${inter.className} antialiased h-screen flex overflow-hidden`}>
        <AuthProvider>
          <Sidebar />
          <main className="flex-1 ml-60 overflow-y-auto">
            {children}
          </main>
          <AddJobModal />
          <JobDrawer />
          <AddContactModal />
          <ContactDrawer />
          <SaveProgressModal />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
