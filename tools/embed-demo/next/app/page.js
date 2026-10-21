import Counter from './counter';

// the EDS site the blocks come from; ?origin=http://localhost:3000 points at a local `aem up`
const DEFAULT_ORIGIN = 'https://embed--bmw--moved-permanently.aem.page';
const PAGE = '/de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick';

export default async function Page({ searchParams }) {
  const { origin = DEFAULT_ORIGIN } = await searchParams;
  return (
    <div className="host-app">
      <div className="host-titlebar">
        <span className="host-badge">Next.js host app</span>
        <span className="host-note">React layout on its own origin. The framed area is BMW content and code, loaded at runtime from {origin}</span>
        <Counter />
      </div>
      <div className="host-frame">
        <div className="host-label">&lt;aem-embed type=&quot;header&quot;&gt;</div>
        <aem-embed type="header" url={`${origin}/nav`} />
      </div>
      <div className="host-frame">
        <div className="host-label">&lt;aem-embed url=&quot;{PAGE}&quot;&gt;</div>
        <aem-embed url={`${origin}${PAGE}`} />
      </div>
      <footer className="host-footer">Host footer rendered by React</footer>
    </div>
  );
}
