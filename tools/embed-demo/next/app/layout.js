import Script from 'next/script';
import './host.css';

export const metadata = {
  title: 'Next.js host with BMW blocks (aem-embed)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        {children}
        {/* aem-embed derives the code base path from its own URL, so it must be served at /scripts/.
            crossOrigin matches Next's preload to the CORS mode of a module script. */}
        <Script src="/scripts/aem-embed.js" type="module" crossOrigin="anonymous" strategy="afterInteractive" />
      </body>
    </html>
  );
}
