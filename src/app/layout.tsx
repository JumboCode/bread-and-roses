import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";

const sofiaPro = localFont({
  src: "./fonts/sofia-pro.woff2",
  variable: "--font-sofia-pro",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Bread and Roses",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sofiaPro.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
