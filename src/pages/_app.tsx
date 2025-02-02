// File: pages/_app.tsx
import './index.css'; // Move your global CSS import here
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
