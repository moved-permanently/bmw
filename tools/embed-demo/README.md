# aem-embed host demos

Two host pages that render BMW site content and blocks with
[aem-embed](https://www.aem.live/docs/aem-embed). Nothing is copied or ported: the host loads
`/scripts/aem-embed.js`, and each `<aem-embed>` fetches its `.plain.html`, code and styles from the
EDS origin at runtime. Changes to content or blocks show up without a release of the host.

`scripts/aem-embed.js` is an unmodified copy of
[adobe/aem-embed@61093c1](https://github.com/adobe/aem-embed/blob/61093c101c75c26f754d2be8f9a72caf68bbbc3e/scripts/aem-embed.js)
(Apache-2.0). `next/public/scripts/aem-embed.js` is the same file.

The EDS origin has to send `access-control-allow-origin` for `.plain.html`, `/scripts/`, `/blocks/`
and `/fonts/` (headers in the site config). A local `aem up` sends `*` on every response.

## Plain HTML

```sh
cd tools/embed-demo
python3 -m http.server 8020
# http://localhost:8020/                                  embed branch preview
# http://localhost:8020/?origin=http://localhost:3000     local aem up
```

## Next.js (App Router)

```sh
cd tools/embed-demo/next
npm install
npm run dev
# http://localhost:3040/                                  embed branch preview
# http://localhost:3040/?origin=http://localhost:3000     local aem up
```

`app/page.js` renders the custom elements in JSX. React 19 passes `url` and `type` to them as
attributes. `app/layout.js` loads the component with `next/script` and `type="module"`.
