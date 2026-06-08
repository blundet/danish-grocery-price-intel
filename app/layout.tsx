import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danish Grocery Price Intel",
  description: "Admin dashboard for flyer uploads and product management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
