'use client';

import Script from 'next/script';

/**
 * Google Analytics component that loads GTM scripts
 * This component should be included in the root layout to track all page interactions
 */
export const GoogleAnalytics = () => {
  // Google Tag Manager measurement ID
  const GA_MEASUREMENT_ID = 'G-G9432QT0ZR';

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};
