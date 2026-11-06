# Reference handoff — slice 1

AI-generated reference, never submission work. Top-level repository is the module's personal GitHub backup. Work only in `001 Newsletter Context/reference-newsletter`; stage/commit only that path. No Stugit pushes. User authorised personal GitHub pushes.

## Decisions

Auth.js Credentials + JWT sessions; server reads/actions; no Redux. Tabs, named functions, simple DaisyUI. Separate local DB `newsletter_reference`, login `newsletter_reference_app`. User authenticated creation of the DB/login; random credentials are saved in the ignored owner-only .env; never copy submission credentials. Run app on 3001. Stop after every completed slice for feedback.

## Current slice

Slice 1 complete: schema/config/client and labelled UI shell implemented. No auth, CRUD, public data or route protection yet. All shell routes contain placeholders; UI must not suggest otherwise.

Verified 6 November 2026:
- Reference-only login/database connection and schema synchronisation passed; User/Newsletter tables and author FK verified.
- Prisma validation/generation, ESLint, production build and TypeScript passed.
- All seven page routes returned 200 with the shared reference banner/header; desktop preview inspected.
- Wrong database, role, host and URL-override inputs were rejected by the connection guard.
- Submission-file fingerprints unchanged. Real .env is ignored with permissions 0600; generated/dependency/build files excluded.

Database is ready; next task is user review, then slice 2 only after their reply. No auth or protection is claimed yet.

Commit: `reference: add isolated newsletter foundation and schema`. Exact self-referential commit hashes cannot be embedded in the same commit; locate slice 1 using `git log --oneline -- "001 Newsletter Context/reference-newsletter"` from module root.

## Next slices (only after review)

2. Credentials registration/login/logout, session id propagation, 8h session setting, verified dashboard proxy and per-operation checks. High effort only for auth callbacks/security; use gpt-6-luna low/medium for routine isolated work per latest user direction.
3. Author-owned newsletter CRUD/status; shared form, owner-filtered writes; no trust in submitted authorId.
4. Public Sent-only feed, refresh correctness, browser checks and final source/rubric explanations.

## Interfaces and source facts

User id is cuid string; name nullable; password stores hash. Newsletter has title/content/image/status/authorId/timestamps; enum Draft/Schedule/Sent. No scheduler or mail sending. Database generation goes to ignored `app/generated/prisma`. Root Prisma config loads dotenv; reference URL guards apply to config, runtime client and db check. Build does not query DB until later slices.

README Sources records full PDF names/pages/Blackboard links. Do not attribute added ownership/security adaptation as verbatim lab code. No external fonts/assets or production services.
