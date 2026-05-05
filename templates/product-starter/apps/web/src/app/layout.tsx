import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Starter",
  description: "Offline-ready enterprise product starter"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

