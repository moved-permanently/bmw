# Briefing I connected news rehearsal

Run `npm run aida:news` and open <http://127.0.0.1:3001>. This is an optional **loopback-only companion**, not part of EDS page delivery and not a replacement for DA. The server and its state are excluded from EDS serving. No new dependencies or website build step are required.

## Scope and boundaries

- Create HQ and market-authored news; review a locked revision; reject with field-addressed feedback; edit and resubmit; approve; roll out to DE/AT/FR/BE; preserve separately owned local fields on source updates; release or schedule locally; inspect notifications, versions and operational metrics.
- Review capabilities are random, stored as hashes, valid for one revision and one hour, and revoked after a decision. They stay in a URL fragment, are removed from the address bar when opened, and are not written to the durable store in clear text. **Anyone holding a link on this machine can decide that revision.** These are not verified reviewer identities.
- Persona selection is explicitly a **simulation**, accessible to anyone on this trusted machine. It is not IMS, RBAC provisioning, or a confidentiality boundary against other local users. Do not expose the server through a tunnel, reverse proxy, or non-loopback interface. Use public/synthetic rehearsal copy only.
- Guards are evaluated server-side: role/market, self-approval, review locks, current revision, approved/current HQ source, embargo and release time. They enforce the local process **under the selected simulated identity**, not identity authentication.
- All public HTML, Markdown, fragments, JSON and index routes use immutable released copies, never drafts. A new draft does not replace the previous public release. Dates are timezone-aware and invalid calendar dates are rejected.
- Local publication is **not EDS publication**. Approved DA HTML can be downloaded only after embargo and while the source/revision remain current. Upload and native review/publish are deliberate manual steps, with no automatic API calls or credentials in this service. Local approval cannot disable an EDS user's independent Publish permission.
- HQ central fields and market-only introduction/CTA are an explicit model contract. This is not DA field-level locking, general block merge, or the ability to preserve a moved teaser in arbitrary page composition. Structural rollout copies source text; it does **not** translate it. Use DA Translate or the existing BYO-model agent separately.
- In-app notifications and local request/CTA counters are real rehearsal events. Market decisions/releases notify HQ; market metrics are scoped to that market, and notices remain role-targeted. No email/Teams/Workfront/Jira messages, analytics service, unique-visitor measurement, or BMW conversion attribution are connected. Quality checks here test required fields only; WDH/legal/brand/availability checks remain in the existing DA Preflight.

## Runtime

`AIDA_PILOT_DATA` selects the private JSON ledger; default is `.aida-pilot/state.json` under the invocation directory. `PORT` defaults to 3001. State is saved using an atomic rename and private file permissions; failed persistence rolls back the in-memory mutation, including scheduled release. There is one process and no multi-worker locking, encrypted database, retention policy or tamper-proof audit. Stop the process and use a new state filename for a clean rehearsal; never remove someone else's rehearsal data.

Sessions expire after four hours and are not persisted. Restarting requires selecting a persona again. Approved/scheduled work survives a restart; overdue eligible local releases run when the process resumes. There is no always-on launch SLA. Overdue releases held by HQ drift become `release-blocked` with market/release-operator notices. An HQ edit blocks release of stale market copies until approved source changes are rolled out and those markets approve again.

## Native handoff

Open [DA Translate](https://da.live/apps/loc#/moved-permanently/bmw) and [DA Snapshots](https://da.live/apps/snapshots#/moved-permanently/bmw) from the desk. Snapshots work on **main**, not the feature branch. Native request-review locks a captured preview; rejection unlocks it; **Approve & publish releases immediately**. Platform permissions, protected preview/origins and (if enabled) native scheduling must be configured independently before any confidential launch.

Native shared review passwords are not per-person identity or the sole confidentiality control: source, preview and alternative representations must also be protected. No shared site permissions or publish roles are changed by this code.

The project-folder debrief, slides and detailed demo script are maintained outside this repository, as requested. Tests: `npm test`. Website lint: `npm run lint`; companion CSS: `npx stylelint tools/aida/pilot/ui/style.css`.
