# Reference handoff — slice 2

AI-generated reference, never submission work. Top-level repository is the module's personal GitHub backup. Work only in `001 Newsletter Context/reference-newsletter`; stage/commit only that path. No Stugit pushes. User authorised personal GitHub pushes.

## Decisions

Auth.js Credentials + JWT sessions; server reads/actions; no Redux. Tabs, named functions, simple DaisyUI. Separate local DB `newsletter_reference`, login `newsletter_reference_app`. User authenticated creation of the DB/login; random credentials are saved in the ignored owner-only .env; never copy submission credentials. Run app on 3001. Stop after every completed slice for feedback.

## Current slice

Slice 2 complete: credentials registration, login/logout, isolated session cookies, session-aware navbar and independently protected dashboard pages. Newsletter CRUD/public feed remain unimplemented.

Verified 6 November 2026:
- Reference-only login/database connection and schema synchronisation passed; User/Newsletter tables and author FK verified.
- Prisma validation/generation, ESLint, production build and TypeScript passed.
- All seven page routes returned 200 with the shared reference banner/header; desktop preview inspected.
- Wrong database, role, host and URL-override inputs were rejected by the connection guard.
- Submission-file fingerprints unchanged. Real .env is ignored with permissions 0600; generated/dependency/build files excluded.

Database and authentication are ready; pause for user review before slice 3. Auth integration browser checks pass; see README Verification for coverage and limitations.

Slice 1 commit: 37fb247. Slice 2 commit message: `reference: add credentials authentication and dashboard guards`. Exact self-referential commit hashes cannot be embedded in the same commit; locate the latest slice using `git log --oneline -- "001 Newsletter Context/reference-newsletter"` from module root.

## Next slices (only after review)

2. Authentication complete. Keep checks inside actions as CRUD is added. Use gpt-6-luna low/medium for routine isolated work per latest user direction; stronger model only for demonstrated tricky auth issues.
3. Author-owned newsletter CRUD/status; shared form, owner-filtered writes; no trust in submitted authorId.
4. Public Sent-only feed, refresh correctness, browser checks and final source/rubric explanations.

## Interfaces and source facts

User id is cuid string; name nullable; password stores hash. Newsletter has title/content/image/status/authorId/timestamps; enum Draft/Schedule/Sent. No scheduler or mail sending. Database generation goes to ignored `app/generated/prisma`. Root Prisma config loads dotenv; reference URL guards apply to config, runtime client and db check. Build does not query DB until later slices.

README Sources records full PDF names/pages/Blackboard links. Do not attribute added ownership/security adaptation as verbatim lab code. No external fonts/assets or production services.

Auth contract: POST /api/auth/register takes {name?,email,password,confirmPassword}; 201 success, 400 invalid, 403 bad origin, 409 duplicate, 429 throttle. Client login/signOut use next-auth/react. requireUserId(): Promise<string> redirects missing/deleted users; session.user.id is a database cuid. Cookie prefix newsletter-reference; production reference uses local HTTP only. Browser check command npm run test:auth.

Final slice-2 verification: all auth browser checks including registration throttling passed after the final build; guest registration desktop/390px mobile previews inspected with no horizontal overflow. Submission fingerprint check remains unchanged.
