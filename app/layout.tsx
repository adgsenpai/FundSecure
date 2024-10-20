import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "",
  description:
    "FundSecure is a secure, anonymous, and real-time solution to manage and grow your fundraising campaigns effortlessly.",
  metadataBase: new URL("https://fundsecure.vercel.app"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html lang="en">      
      <body className={cx(sfPro.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="relative z-10 py-32">{children}</main>                  
        <Footer />
        <VercelAnalytics />
      </body>
    </html>
  );
}
