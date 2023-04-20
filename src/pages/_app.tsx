import "@/styles/globals.css";
import {SessionProvider} from "next-auth/react";
import {Inter} from "next/font/google";
import type {AppProps} from "next/app";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * App
 * @param {any} props
 * @return {JSX} App
 */
export default function App({
  Component, pageProps: {session, ...pageProps},
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
