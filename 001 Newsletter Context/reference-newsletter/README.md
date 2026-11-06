# Newsletter reference — AI-generated learning material

**Not submission work. Slice 1 of 4: foundation/schema only.**

This isolated reference follows the module's minimum requirements using the student's existing route structure, dependencies, tabs and simple DaisyUI style. Do not copy it into the coursework/Stugit tree or represent it as independently authored work. No production-readiness claim is made.

## Current behaviour

- Every planned route renders a shared, clearly labelled reference shell on port 3001.
- PostgreSQL/Prisma schema describes the required users, newsletter fields, statuses and author relation.
- Server-only client and CLI guards reject database URLs outside the local reference database/login.
- Registration, login, protected access, CRUD and publication are **not implemented yet**. Dashboard placeholders are public at this stage and contain no private data. They are not evidence of finished route guarding.

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

Build/run: `npm run build`, then `npm start`. Checks: `npm run lint` and `npm run typecheck`. Start only one server on 3001 at a time. No database reset or migrations/shadow database are needed for the initial db-push workflow. A seed is optional under the brief and is not supplied in slice 1.

No database password or AUTH_SECRET belongs in Git. Auth.js will need a locally generated AUTH_SECRET in slice 2; it is not used by this shell.

## Why these pieces exist

| Piece | Role / assessment connection |
|---|---|
| `prisma/schema.prisma` | Brief p3: User, Newsletter, required fields, Draft default and one-to-many authorship. `password` stores a hash once registration exists. |
| `prisma.config.ts` | Prisma 7's CLI URL configuration; private dotenv loading and reference-only guard. |
| `app/lib/prisma.ts` | Server-only adapter/client with development singleton, following Lab 4.1. Does not query data in the shell. |
| `scripts/check-database.mjs` | New isolation safeguard, not a lab requirement: checks database/login before schema writes. |
| Shared layout/navbar | App Router/DaisyUI shell following Lab 3.0. No fake logged-in state. |

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
