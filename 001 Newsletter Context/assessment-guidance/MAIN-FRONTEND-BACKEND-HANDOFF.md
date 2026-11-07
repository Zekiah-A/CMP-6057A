# Main application frontend → backend handoff

AI-generated maintenance notes, outside the Stugit submission tree. This records the frontend work explicitly requested on 7 November 2026; it is not submission prose or a claim of independent authorship.

## Saved work and scope

- Top-level repository: `CMP-6057A (Advanced Web Development)/.git`, never the nested `001 Newsletter/.git`.
- Before editing: commit `a6aada6` saves the user's current application, including existing unfinished backend imports and schema changes.
- Follow-up commit: `newsletter: complete frontend pages and dashboard workflows` (find with top-level Git log).
- No database changes, credentials, auth server implementation, internal Stugit commits or pushes.
- User-facing pages use finished wording. Development notes stay here and in targeted source comments.

## What works now

- `/`: up to five recent Sent newsletters in descending updated-date order, shown as an overlapping DaisyUI stack. Dismiss reveals the next card without deleting any data; covered cards are inert. The current fixtures contain three public newsletters. Dismissals reset when Home is remounted.
- `/newsletters`: full public cards; title/content/author search; unique-author filter; newest/oldest/title ordering; reset; result count; no-results state; Ctrl/Command+K shortcut.
- `/register`, `/login`: full-width centred forms within `max-w-md`, labels, browser validation and existing pending/error handling. Login displays the success message for `?registered=1`.
- `/dashboard`: newsletter cards, search, status filter, Create/View/Edit/Delete controls and empty states.
- `/dashboard/create`, `/dashboard/edit/[id]`: shared form; Draft default; exact Draft/Schedule/Sent values; image URL field; save/cancel/error handling.
- `/dashboard/view/[id]`: complete content, status and edit/delete/back controls. Unknown/deleted ids show an unavailable-record view.
- One layout and consistent heading, button, card, spacing and form sizes. Navbar pills stay 40px tall and use a second row on smaller screens.
- URL image rendering with an error fallback; content rendered as escaped plain text.

## Temporary behaviour — replace before assessment

`app/lib/preview-newsletters.ts` supplies **invented fixture content**, adapted from Lab 3.1's static-data teaching pattern. Replace it with your own database records; the examples are not evidence of a working CMS.

`NewsletterWorkspace.tsx` holds dashboard fixtures in React state under the dashboard layout. Changes survive client navigation within that layout only. Reloading, opening a copied URL for a newly created item, or leaving/re-entering the layout resets the fixtures. There is no persistence, login requirement or ownership enforcement. Workspace changes do not update the separate public fixture feed. These are frontend stubs, not completed CRUD/publication criteria.

The `author` display string is a frontend convenience, not the required `authorId` foreign key. The real server must derive authorship from a verified session. Never accept it from the form/provider.

Login and registration retain the existing real endpoint/signIn call sites and error handling, but their backend routes are absent. No fake login or registration success is implemented. Home and navbar still receive no verified session; authenticated display is not wired. The success banner query flag is a UI message, never proof of account creation/authentication.

Unknown ids currently show client UI with HTTP 200. Replace with owner-scoped server reads and Next `notFound()` for the appropriate HTTP behaviour.

Client-only filtering is for usability, **never confidentiality**. The backend must query `Sent` before returning any public fields, not fetch private rows and hide them in React.

## Connect the backend in this order

1. Finish User/Newsletter Prisma models and their relationship, using the required fields/statuses (brief v4 pp. 2–3; Lab 4.1 pp. 4–8). No database/migration commands were run in this frontend task.
2. Implement registration and Auth.js Credentials/JWT sessions. Match server/password validation to your chosen policy: the existing main registration form currently requires 8 characters plus upper/lowercase and a number, whereas the isolated reference requires 12 characters and enforces bcrypt's 72-byte maximum. Do not leave conflicting client/server rules. Lab 5 pp. 4–9, 30–38.
3. Pass the verified session user into Navbar/HomeContent and wire real logout. Do not use the workspace context as authentication state. Guard `/dashboard` descendants and independently enforce sessions inside every protected read/action.
4. Replace workspace methods with server actions and server reads. Keep form/UI components; replace the `onSave` callback wiring (or return to `useActionState` for server validation feedback). Owner-scope actual updates/deletes by both record id and verified user id. Preserve input and show pending/errors. Lab 4.1 pp. 14–18; Week 4 lecture pp. 63–64, 67–74.
5. Replace public fixtures with a server Prisma `where: { status: "Sent" }` query selecting public fields only; reuse it for Home and `/newsletters`. Revalidate both pages and dashboard routes after mutations. Schedule is a private status; no scheduler/SMTP was introduced.
6. Check two-account isolation and direct operation denial, persistence, publish/unpublish refresh, logout/session expiry, invalid inputs, broken images, and setup reproducibility. Frontend checks below do not prove these backend properties.

## Teaching provenance

All PDFs below are unchanged originals in `assessment-guidance/sources/`. Physical page numbers. For original Blackboard paths/links see `RESOURCE-MAP.md`.

| Main files | Source mechanism | Adaptation |
|---|---|---|
| `newsletter-types.ts`, fixtures, `NewsletterCard`, view/edit routes | `02-3.1.Next-continue-RTK.pdf` pp. 3–8: typed static newsletter data, mapped list, dynamic id lookup and missing record UI | Fields/routes adapted to this brief. Client missing-record view is temporary; the lab's server `notFound` pattern belongs in the backend. |
| `NewsletterFeed`, workspace state | `02-2.1.REACT-Typescript-states.pdf` pp. 4–10: author deduplication, state and list filtering | Newsletter-specific search/sort and immutable CRUD helpers added here; not copied lab CRUD or a security pattern. |
| Dashboard layout | `01-3-Next.js-RTK-v2.pdf` pp. 16–26: App Router route files/nesting/dynamic segments | A temporary React context shares frontend state across dashboard pages; no Redux claim. |
| Newsletter/login/register forms | `01-5.0-Auth-custom-credentials-Auth.js.pdf` pp. 18–23; `01-4-web-security-auth0-PrismaORM-v3.pdf` pp. 63–64 | Labels, input state, pending/error feedback; newsletter form currently uses a client callback, not a server action. |
| Cards, inputs, dropdown and navbar | Existing source comments link the relevant DaisyUI component documentation | Simple Tailwind sizing, the user's pill design and existing attribution retained. |

These are adapted mechanisms, not proof that generated lines were university-authored. New comments avoid signing generated work as the student's own. Existing personal attributions remain unchanged.

## Verification

- `npm run lint`: passed.
- TypeScript: passed; production build includes TypeScript checking.
- `npm run build`: passed after removing optional experimental `cacheComponents`/`partialPrefetching` settings that blocked dynamic routes. CSS loader and dependency versions retained; Turbopack root pinned to this application.
- Browser checks on production: Home cards; public search/author/date sort/reset/shortcut; create/view/edit/status; cancelled/confirmed deletion; dashboard status filter; missing id.
- All eight page types checked at 360/768/1440px: no horizontal overflow; registration form width checked; no uncaught browser exceptions.
- Screenshots inspected for mobile register/dashboard and desktop Home. Temporary test scripts/screenshots are outside Stugit under `/tmp/`.
- No claim of completed security, authentication, persistence or public publication tests: backend work is still required.
