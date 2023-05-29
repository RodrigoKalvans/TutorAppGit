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
 * @param {AppProps} props
 * @return {JSX} App
 */
export default function App({
  Component, pageProps: {session, ...pageProps},
}: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
