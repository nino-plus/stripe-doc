import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';

const SITE_TITLE = 'Stripeビギナーズガイド';
const SITE_URL = 'https://dninomiya.github.io/stripe-doc';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableColorScheme={false}
    >
      <Head>
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${
            process.env.NODE_ENV === 'production' ? '/stripe-doc' : ''
          }/favicon.svg`}
        />
      </Head>
      <DefaultSeo
        openGraph={{
          type: 'website',
          url: SITE_URL,
          site_name: SITE_TITLE,
          images: [
            {
              url: SITE_URL + '/ogp.png',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
        titleTemplate={`%s | ${SITE_TITLE}`}
        description="はじめてStripeを導入する方に向けたオープンソースの実装ガイドです。"
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </ThemeProvider>
  );
}

export default MyApp;
