# Newsletter reference — AI-generated learning material

**Not submission work. Slice 3 of 4: owner-isolated newsletter CRUD.**

This isolated reference follows the module's minimum requirements using the student's existing route structure, dependencies, tabs and simple DaisyUI style. Do not copy it into the coursework/Stugit tree or represent it as independently authored work. No production-readiness claim is made.

## Current behaviour

- Every planned route uses the shared, clearly labelled reference layout on port 3001.
- PostgreSQL/Prisma schema describes the required users, newsletter fields, statuses and author relation.
- Server-only client and CLI guards reject database URLs outside the local reference database/login.
- Registration, login/logout and session-aware navigation now work. Dashboard and descendants require a verified session and an existing database user.
- Owner-isolated dashboard viewing, creation, editing, deletion and status updates now work. The public newsletter feed is **not implemented yet** (slice 4).

## Run locally

Use Node 22 (22.19.0 was available during setup) and npm. The app retains Next 16, Auth.js v5 beta and Prisma 7 versions from the original project. The reference uses conventional Tailwind 4 PostCSS configuration instead of the original experimental loader/caching settings.

From this directory:

1. `npm ci`
2. Create a **new local** database login and database. The user chose to do this manually:

   ```sh
   sudo -iu postgres createuser --pwprompt --no-superuser --no-createdb --no-createrole newsletter_reference_app
   sudo -iu postgres createdb --owner=newsletter_reference_app newsletter_reference
   ```

   These names must match the reference guards. If they already exist, inspect them; do not delete/reset existing databases.
3. Copy `.env.example` to `.env`. Enter the new role's password in DATABASE_URL locally. URL-encode password characters where needed. Do not use the coursework database or share its credentials. The reference accepts localhost/127.0.0.1 only and deliberately disallows URL query parameters; omit `?schema=public`.
4. `npm run db:check` — read-only connection identity check.
5. `npm run db:validate` and `npm run db:generate` — validate schema and generate the local client.
6. `npm run db:push` — checks identity first, then creates/synchronises tables in the reference database only. Review any data-loss warning; never automatically accept it.
7. `npm run db:check -- --schema` — verify both tables and the author foreign key.
8. `npm run dev` — open http://localhost:3001.

Build/run: `npm run build`, then `npm start`. Checks: `npm run lint` and `npm run typecheck`. Start only one server on 3001 at a time. No database reset or migrations/shadow database are needed for the initial db-push workflow. A seed is optional under the brief; register your own disposable local account to try authentication.

No database password or AUTH_SECRET belongs in Git. Auth.js requires the locally generated AUTH_SECRET; changing it invalidates current sessions.

## Why these pieces exist

| Piece | Role / assessment connection |
|---|---|
| `prisma/schema.prisma` | Brief p3: User, Newsletter, required fields, Draft default and one-to-many authorship. `password` stores a hash once registration exists. |
| `prisma.config.ts` | Prisma 7's CLI URL configuration; private dotenv loading and reference-only guard. |
| `app/lib/prisma.ts` | Server-only adapter/client with development singleton, following Lab 4.1. Does not query data in the shell. |
| `scripts/check-database.mjs` | New isolation safeguard, not a lab requirement: checks database/login before schema writes. |
| Shared layout/navbar | App Router/DaisyUI shell following Lab 3.0; Lab 5 session hooks determine actual account controls. |

Rubric p7 assigns 5% to registration, 15% to security, 5% to schema, 15% to dashboard CRUD, 5% to public feed and 5% to structure. The remaining 25% desirable and 25% viva are separate. This unfinished slice does not demonstrate the completed categories or guarantee marks.

## Sources and adaptation boundaries

Physical PDF pages refer to single-slide originals. Local paths are relative to this reference directory.

| Source | Exact pages and use | Blackboard |
|---|---|---|
| [001-Advanced-Web-Development-v4.pdf](../advanced-web-development/Assessment/Assessment%20briefs/001%20-%20Web%20Application%20Project%20Brief/ultraDocumentBody/_6068079_1/01-001-Advanced-Web-Development-v4.pdf) | pp2–3 minimum behaviour/schema; p5 deliverables; p7 rubric | [Brief](https://learn.uea.ac.uk/ultra/courses/_158570_1/outline?contentId=_6068079_1) |
| [3.0.Next-TS-client-component-API-useEffect.pdf](../assessment-guidance/sources/01-3.0.Next-TS-client-component-API-useEffect.pdf) | pp3–6 setup; pp10–16 shared navbar | [Week 3 labs](https://learn.uea.ac.uk/ultra/courses/_158570_1/outline?contentId=_5981788_1) |
| [4.1-Prisma-ORM.pdf](../assessment-guidance/sources/02-4.1-Prisma-ORM.pdf) | pp4–8 model/client/adapter; pp14–18 server-action CRUD for later slice | [Week 4 labs](https://learn.uea.ac.uk/ultra/courses/_158570_1/outline?contentId=_5981790_1) |
| [4.0-Next-Auth.pdf](../assessment-guidance/sources/01-4.0-Next-Auth.pdf) | pp12–17 Auth.js setup; used in slice 2 | [Week 4 labs](https://learn.uea.ac.uk/ultra/courses/_158570_1/outline?contentId=_5981790_1) |
| [5.0-Auth-custom-credentials-Auth.js.pdf](../assessment-guidance/sources/01-5.0-Auth-custom-credentials-Auth.js.pdf) | p2 appearance; pp4–9 hashing/registration; pp30–38 final Credentials/session pattern | [Week 5 lab](https://learn.uea.ac.uk/ultra/courses/_158570_1/outline?contentId=_5981792_1) |
| [4-web-security-auth0-PrismaORM-v3.pdf](../assessment-guidance/sources/01-4-web-security-auth0-PrismaORM-v3.pdf) | pp59–64 server actions/form feedback; pp67–74 endpoint defence | [Week 4 lecture](https://learn.uea.ac.uk/ultra/courses/_158570_1/outline?contentId=_5981714_1) |

Comments mark demonstrated patterns as adaptations. Newsletter-specific schema, ownership predicates, publication filtering and isolation safeguards are additions required by this project, not verbatim lab snippets. Current Prisma 7 configuration/client output follows [Prisma configuration](https://www.prisma.io/docs/orm/reference/prisma-config-reference); navbar controls follow [DaisyUI](https://daisyui.com/components/navbar/).

### Gotchas to preserve in later slices

- Lab 5 p5's base64 token and lecture 5 p101's cookie-presence check do not verify an identity. Use verified Auth.js sessions.
- Lab 4.1's intermediate user CRUD stores/displays plaintext passwords. Do not retain that demonstration in the completed reference.
- Lab proxy policy blocks public pages; adapt it to dashboard-only protection, then authorise every server operation independently.
- Name is optional, although a lab form requires it. Authentication never establishes permission to edit someone else's newsletter.
- Schedule is a private status only; Sent means web publication. No mail delivery, scheduler, OAuth, roles, Redis or Redux is in scope.
- Final MP4, single-page architecture diagram, README/auth description and Stugit submission are assessed deliverables; this reference is not a replacement for your submission or viva.

Progress and restart context: [HANDOFF.md](HANDOFF.md).

## Slice 2: authentication walkthrough

1. Open `/register`, optionally enter a name, and choose an email/password. Passwords require at least 12 characters and at most 72 UTF-8 bytes (bcrypt's limit); no silent truncation.
2. The JSON registration endpoint validates origin/input, normalises email, hashes with bcrypt cost 12 and inserts User. Database uniqueness handles concurrent duplicates. Only the new reference database is used.
3. Log in using the new account. Auth.js Credentials looks it up and compares hashes; invalid credentials get a generic failure. Registration does not log you in automatically.
4. Auth.js issues its encrypted JWT cookie. The jwt/session callbacks expose only id/name/email; authorisation never uses client state as proof.
5. The verified Auth.js proxy checks dashboard routes, and each server page calls `requireUserId()` to also reject removed users. Later mutations must call this helper too; hiding a link is not protection.
6. Logout uses Auth.js signOut, clears its cookie and refreshes the session UI. There is no manual localStorage session cache.

Files: `auth.ts`, `proxy.ts`, `app/lib/credentials.ts`, `app/lib/session.ts`, registration/catch-all route handlers and the two forms. These adapt Lab 5 pp4–9, 18–23 and 30–38; cookie separation, server validation and direct authorisation are project safeguards.

### Deliberate limitations

- **Local HTTP reference only.** The app binds to loopback and uses non-Secure HttpOnly/SameSite=Lax cookies. Do not deploy this config publicly. Cookies use the `newsletter-reference.*` prefix to avoid collisions with coursework auth on another port. They are host-scoped, not port-scoped: use the same hostname consistently.
- Session maxAge is eight hours. Activity/session refresh may extend it; this is not an absolute eight-hour-since-login policy. Logout removes this browser's cookie but does not revoke a previously copied token until expiry. Changing AUTH_SECRET invalidates all reference sessions.
- Throttling is a bounded in-memory email-keyed counter: login 10/15 minutes, registration 5/15 minutes. It resets on restart, is not shared across processes, can be bypassed by varying emails and can temporarily deny an address targeted by others. This demonstrates a local defence, not production abuse protection.
- Duplicate registration returns 409 and therefore reveals that an email is already registered. Login stays generic; a dummy hash comparison reduces one timing difference but does not promise identical response times.
- A successful sign-in is not permission to access another author's data. Owner-scoped queries arrive in slice 3.

### Verification

Start the reference on port 3001, then `npm run test:auth` (uses Playwright and `/usr/bin/chromium`; set CHROMIUM_PATH for another installed Chromium). Run only against the reference database. The script creates a unique disposable account and deletes only that account afterwards. It checks guest denial on all dashboard pages, registration origin and password policy, optional-name UI signup, hash storage, duplicate normalisation, throttling, failed/successful login, reload, safe session fields, HttpOnly cookie, forged/expired tokens, logout and deleted-user access. Expected denial events can appear in server logs; user/session payloads are not logged by the custom logger.

`npm run lint`, `npm run build` and `npm run typecheck` also pass. Newsletter ownership checks are covered separately below; public publication remains for slice 4.

## Slice 3: newsletter CRUD walkthrough

From `/dashboard`, select **Create Newsletter**. Enter a title, plain-text content, optional image URL, and status (Draft by default). The server assigns the logged-in author; form-supplied author ids are ignored. The same `NewsletterForm` handles editing via a bound server action. Controlled inputs preserve your text when server validation fails. Pending state disables submit, and errors are returned to the form.

The dashboard lists only your records, ordered by last update. **View newsletter** expands the full text without interpreting HTML; **Edit** changes fields/status; **Delete** requires browser confirmation. The image URL is stored/shown as text here; the public reader/image display comes in slice 4. Schedule is only a private status, not an automated timer. Sent can be selected now, but publication will not appear until the feed is implemented.

- `app/lib/newsletters.ts`: verifies the database user, then filters every private read by author id. A missing or non-owned edit target gives 404 without leaking its content.
- `app/actions/newsletters.ts`: each action independently calls `requireUserId()`. Updates/deletions constrain the actual database mutation by both record id and verified author id, checking the affected count. Bound action arguments and hidden controls do not replace this check.
- `app/lib/newsletter-validation.ts`: server Zod checks apply even when client HTML is bypassed. Title ≤200 characters, content ≤20,000, image empty or HTTP(S) ≤2048 with no URL credentials, status strictly Draft/Schedule/Sent. Length limits are reference design choices; exact statuses are brief requirements.
- Actions revalidate dashboard/public paths, then redirect outside their database-error catches. Revalidation prepares for the next slice; no API duplicates or client data store are introduced.

Source pattern: Lab 4.1 pp14–18 (Prisma/server-action CRUD), Week 4 lecture pp59–64 (validation/action-state feedback). Newsletter ownership, statuses and fields are new adaptations of brief p3, not verbatim lab snippets. This slice addresses dashboard CRUD (15%) and supports security (15%) and structure (5%); those category weights do not imply this slice guarantees those marks.

Run `npm run test:newsletters` with the app on port 3001. Two unique disposable accounts exercise create/view/edit/status/delete and are removed afterwards (only their records). The script tests forged authorId, another-user list/read denial, server rejection of invalid status, and replayed update/delete actions using another session or no session. Replays target a public URL to avoid relying solely on the dashboard proxy; tests check returned action denial and unchanged database rows. It also checks cancellation before the owner deletes the record. No existing data is reset.
