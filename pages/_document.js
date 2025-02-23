import { Html, Head, Main, NextScript } from "next/document";
import { colorModeScript } from '@chakra-ui/react';

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body>
      {colorModeScript()} {/* This is important for Chakra UI */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
