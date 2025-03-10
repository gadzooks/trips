// app/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      {/* Keeps width=device-width to match the device width
      Sets maximum-scale=5.0 to allow zooming up to 5x
      Changes user-scalable=no to user-scalable=yes to enable pinch-to-zoom
      Maintains viewport-fit=cover for edge-to-edge display on notched devices

      This configuration prevents horizontal scaling while still allowing users to zoom in for better readability when needed. */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}