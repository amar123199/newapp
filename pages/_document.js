import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        {/* Link to the manifest file */}
        <link rel="manifest" href="/manifest.json" />
          {/* You can add other PWA meta tags like icons, theme-color, etc. */}
          <meta name="theme-color" content="#000000" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
      
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
