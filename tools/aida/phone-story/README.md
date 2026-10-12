# One story, two experiences

A separate Experience Workspace app for the BMW content-delivery demonstration. It reuses CURVE's phone design and authored-source parsing, with a five-step presentation guide. No localhost server, backend deployment or build step is needed.

## Entry points

- [DA app](https://ewdemo--da-live--adobe.aem.live/app/moved-permanently/bmw/tools/aida/phone-story/phone-story?ref=main)
- [Standalone app](https://main--bmw--moved-permanently.aem.page/tools/aida/phone-story/phone-story.html)
- [Source story](https://main--bmw--moved-permanently.aem.page/aida/showcase/en/news/i5-film-v2)

DA's app shell adds `.html` to the app path. For a code branch, change `ref=main` to that branch. The source story always comes from the main public preview, even when app code runs on a branch.

## Present the case

1. Open the app and the linked website. Show the authored headline and image.
2. Choose **The app**, then **Refresh content**. CURVE reads the same story in a phone layout.
3. Choose **Make a change** and open **Edit the source**. Add a short phrase to the headline in Content view, save and Preview. Do not Publish. Keep the original headline for restoration.
4. Check the website preview, then return to CURVE without refreshing: the previous headline is still shown.
5. Choose **See it here** and **Refresh content**. The new headline appears, with a before/after summary. If preview still returns the old version, allow the edge cache to update and retry.
6. Restore the original headline, save and Preview. Refresh the app again.
7. Choose **How it works** and inspect the Markdown and HTML fragment links.

**Reset this demo** clears only the app's in-memory reading session. It does not restore source content. Closing or reloading the app also clears that reading session.

## Delivery

The app makes two anonymous requests per explicit refresh: the story's `.md` and `.plain.html`. When hosted on the main preview origin it reads those URLs directly. DA iframe hosts and other origins use DA's existing ETC public CORS proxy, because AEM's public Markdown response does not supply cross-origin browser access headers. No author token is used.

The phone renders text rather than inserting source HTML. It displays the authored image URL, linked WDH value text and legal statement. It does not fetch the WDH sheet, translate copy or generate missing facts. A failed refresh keeps the last successful reading and labels it stale; an initial failure shows no story. Requests time out after 15 seconds and oversized responses are rejected.

This is a preview consumer and a custom demonstration, not the My BMW App or a production mobile integration. Content is public. Protected launches, automatic synchronization, offline storage and live WDH access are not implemented. A production channel would read approved live content and apply its own access rules.
