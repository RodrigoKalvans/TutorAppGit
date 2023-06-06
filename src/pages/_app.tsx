import "@/styles/globals.css";
import {SessionProvider} from "next-auth/react";
import {Inter} from "next/font/google";
import type {AppProps} from "next/app";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import BoxContainer from "@/components/profilePage/helpingComponents/BoxContainer";
import ContentLoader from "react-content-loader";
import Navbar from "@/components/Navbar";

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Add the loading state to only pages that use getServerSideProps
  useEffect(() => {
    const handleChangeStart = (url: string) => {
      if (url && (url.toString().startsWith("/tutors/") || url.toString().startsWith("/students/"))) {
        setIsLoading(true);
      }
    };

    const handleChangeEnd = (url: string) => {
      if (url && (url.toString().startsWith("/tutors/") || url.toString().startsWith("/students/"))) {
        setIsLoading(false);
      }
    };

    // Add events to the router changes
    router.events.on("routeChangeStart", handleChangeStart);
    router.events.on("routeChangeComplete", handleChangeEnd);
    router.events.on("routeChangeError", handleChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleChangeStart);
      router.events.off("routeChangeComplete", handleChangeEnd);
      router.events.off("routeChangeError", handleChangeEnd);
    };
  }, [router]);

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        {isLoading ? (
          <>
            <Navbar black={true} />
            <main className="container py-2 min-h-screen">
              <BoxContainer style="hidden lg:w-2/5">
                {/* <MyLoader /> */}
                <ContentLoader
                  speed={2}
                  width={1100}
                  height={500}
                  viewBox="0 0 400 160"
                  backgroundColor="#000000"
                  foregroundColor="#dbdbdb"
                >
                  <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
                  <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
                  <circle cx="22" cy="22" r="20" />
                  <rect x="158" y="136" rx="0" ry="0" width="3" height="0" />
                  <rect x="4" y="64" rx="3" ry="3" width="35" height="11" />
                  <rect x="4" y="94" rx="3" ry="3" width="43" height="5" />
                  <rect x="4" y="83" rx="3" ry="3" width="43" height="5" />
                  <rect x="6" y="114" rx="3" ry="3" width="35" height="11" />
                  <rect x="6" y="144" rx="3" ry="3" width="43" height="5" />
                  <rect x="6" y="133" rx="3" ry="3" width="43" height="5" />
                  <rect x="77" y="64" rx="3" ry="3" width="35" height="11" />
                  <rect x="77" y="94" rx="3" ry="3" width="43" height="5" />
                  <rect x="77" y="83" rx="3" ry="3" width="43" height="5" />
                  <rect x="76" y="114" rx="3" ry="3" width="35" height="11" />
                  <rect x="76" y="144" rx="3" ry="3" width="43" height="5" />
                  <rect x="76" y="133" rx="3" ry="3" width="43" height="5" />
                </ContentLoader>
              </BoxContainer>

              <BoxContainer style="w-full lg:hidden">
                {/* <MyLoader /> */}
                <ContentLoader
                  speed={2}
                  width={250}
                  height={400}
                  viewBox="0 0 250 400"
                  backgroundColor="#ededed"
                  foregroundColor="#dbdbdb"
                >
                  <rect x="108" y="47" rx="3" ry="3" width="129" height="9" />
                  <rect x="108" y="73" rx="3" ry="3" width="77" height="9" />
                  <rect x="123" y="187" rx="0" ry="0" width="2" height="0" />
                  <rect x="11" y="141" rx="3" ry="3" width="60" height="19" />
                  <rect x="11" y="193" rx="3" ry="3" width="74" height="9" />
                  <rect x="11" y="174" rx="3" ry="3" width="74" height="9" />
                  <rect x="15" y="227" rx="3" ry="3" width="60" height="19" />
                  <rect x="15" y="279" rx="3" ry="3" width="74" height="9" />
                  <rect x="15" y="260" rx="3" ry="3" width="74" height="9" />
                  <rect x="137" y="141" rx="3" ry="3" width="60" height="19" />
                  <rect x="137" y="193" rx="3" ry="3" width="74" height="9" />
                  <rect x="137" y="174" rx="3" ry="3" width="74" height="9" />
                  <rect x="135" y="227" rx="3" ry="3" width="60" height="19" />
                  <rect x="135" y="279" rx="3" ry="3" width="74" height="9" />
                  <rect x="135" y="260" rx="3" ry="3" width="74" height="9" />
                  <circle cx="46" cy="66" r="44" />
                </ContentLoader>
              </BoxContainer>
            </main>
          </>
      ) : (

          <Component {...pageProps} />

      )}
      </SessionProvider>
    </>
  );
}
