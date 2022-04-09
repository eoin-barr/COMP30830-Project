import Head from "next/head";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel='shortcut icon'
          type='image/png'
          href='https://res.cloudinary.com/dk0r9bcxy/image/upload/v1638291047/WAD/logo4_bpwnsi.png'
        />
        <title>Bikes Locator</title>
        <meta name='description' content='Find bikes near you' />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
