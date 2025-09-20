import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import AuthSession from "./_component/AuthSession";
import { MSWProvider } from "./_component/MSWComponent";
import "./globals.css";

if (
  process.env.NEXT_RUNTIME === "nodejs" &&
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_MSW_ENABLED !== "false"
) {
  import("@/mocks/http").then(({ server }) => server.listen());
}

export const metadata: Metadata = {
  title: "Z. 무슨 일이 일어나고 있나요? /Z",
  description: "Z.com inspired by X.com",
};

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MSWProvider>
          <AuthSession>{children}</AuthSession>
        </MSWProvider>
      </body>
    </html>
  );
}
