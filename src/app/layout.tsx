import { ClientRoot } from "@/components";
import "../styles/globals.css";

export const metadata = {
  title: "AI Tutor",
  description: "Voice-based AI Tutor Service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
