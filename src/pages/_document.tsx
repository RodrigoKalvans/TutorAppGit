import {Html, Head, Main, NextScript} from "next/document";

/**
 * Document
 * @return {JSX} Document
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="favicon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
