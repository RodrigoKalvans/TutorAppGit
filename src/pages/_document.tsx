import {Html, Head, Main, NextScript} from "next/document";

/**
 * Document
 * @return {JSX} Document
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
