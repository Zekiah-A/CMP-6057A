# Newsletter 001: start here

AI-produced learning guidance, not submission material. Prepared 5 November 2026 for CMP-6057A. Application source and assets remain entirely yours. Keep this directory out of your Stugit repository and submission; acknowledge AI assistance honestly in your own words as required by [Submission guidance](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Summative Assessment/{001}{CMP-6057A-26-SEM1-A}/_6115945_1/01-submission guidance.md>).

## What you are building

A secure full-stack newsletter **publishing CMS**. Guests read published newsletters. Registered users sign in and create, view, edit, delete and change the status of **their own** newsletters. The database and server enforce these rules even if someone ignores the UI. Next.js App Router, TypeScript, PostgreSQL, Prisma, Tailwind and DaisyUI are required ([Brief v4](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Assessment/Assessment briefs/001 - Web Application Project Brief/ultraDocumentBody/_6068079_1/01-001-Advanced-Web-Development-v4.pdf>), pp1–3).

The confusing part is separating finished assessment behaviour from teaching exercises. You do not need to reproduce the books/people demonstrations or complete every lab before starting. Use the exact sections linked in [RESOURCE-MAP.md](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/assessment-guidance/RESOURCE-MAP.md>) when needed.

## What earns marks

| Assessment category | Weight | Priority |
|---|---:|---|
| Registration | 5% | Secure stored credentials and working signup |
| Security, route guarding and sessions | 15% | Server validation, session lifecycle, protected operations |
| PostgreSQL/Prisma schema | 5% | Required fields and ownership relation |
| Protected dashboard CRUD | 15% | Complete working ownership-isolated workflow |
| Public newsletter feed | 5% | Sent only, including after status changes |
| Code structure/best practices | 5% | Clear responsibilities, validation, maintainable types |
| Desirable features | 25% combined | Only after verified core; no per-feature marks published |
| Oral defence | 25% | Explain and modify your own work |

Source: [Brief v4](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Assessment/Assessment briefs/001 - Web Application Project Brief/ultraDocumentBody/_6068079_1/01-001-Advanced-Web-Development-v4.pdf>), p7. The core plus viva cover 75 percentage points of the rubric, not a promised score. Brief p4 also evaluates completeness, complexity, usability, aesthetics and coding quality. A large unfinished feature list is a poor use of six hours.

## Deliverables you must protect time for

- Before **Friday 6 November 2026, 15:00 London time**: maximum **15-minute MP4** and **single-page PDF architecture/workflow diagram** to Blackboard; source to **CMP Stugit**. Include your own README with working setup steps, authentication approach and secret-free environment variable template. A seed or sample test credentials are recommended, not mandatory. No five-page report for CMP-6057A ([Brief v4](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Assessment/Assessment briefs/001 - Web Application Project Brief/ultraDocumentBody/_6068079_1/01-001-Advanced-Web-Development-v4.pdf>), p5).
- Your published schedule lists **Wednesday 11 November 2026, 09:00, Sci 2.27** ([Published viva schedule](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Assessment/Assessment briefs/001 - Viva slots/ultraDocumentBody/_6068087_1/01-6057-7057 001 VIVA slots-v3.pdf>), p1, row with your name). Double-check Blackboard before attending. A 10-minute slot is stated in the brief; do not infer a longer assessment from gaps in the timetable.
- Viva attendance is compulsory. The brief says an unexcused absence without approved EC gives zero for the assessment; expect two random implementation questions and potentially a five-minute change ([Brief v4](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Assessment/Assessment briefs/001 - Web Application Project Brief/ultraDocumentBody/_6068079_1/01-001-Advanced-Web-Development-v4.pdf>), p4).

Fresh Chalk download confirmed the same brief and deadline on 5 November. The assignment entry has three attempts; generic submission guidance discusses replacement submissions, so inspect the live submission screen early rather than assuming unlimited replacements.

## Six-hour working sequence

These are planning estimates, not assurances. Start the clock when you begin working. If you have less time left, preserve the final 90 minutes and reduce feature scope.

| Elapsed | Your task | Stop/checkpoint |
|---|---|---|
| 0:00–0:25 | Confirm auth choice; scaffold the taught stack; establish Stugit and a reachable PostgreSQL database | App runs and database connects; identify blockers now |
| 0:25–1:35 | Required models, registration, login/logout and session-derived navbar | A new user signs in; wrong password fails; logout removes access |
| 1:35–3:25 | Dashboard list/create/view/edit/delete/status; ownership checks on every operation | Two users cannot access each other's private records |
| 3:25–4:00 | Public feed, Sent filtering, mutation refresh and basic usable forms | Guest sees Sent only; unpublish removes it |
| 4:00–4:30 | Finish missing core behaviour; consider one tiny improvement only if checks pass | Freeze features at 4:30 |
| 4:30–5:00 | Run security/functional checks and setup/build checks | Record actual limitations; fix highest-impact failures |
| 5:00–5:25 | Draw your own diagram; record a concise demonstration | MP4 plays; PDF is one readable page |
| 5:25–6:00 | Finish your README/env template; push; upload and verify receipt/files | Verify remote commit and submitted files before deadline |

Do not spend the core budget on deployment, SMTP, a rich-text editor, image uploads, Redux or a complex theme. None is an explicit minimum requirement. Choose a simple image URL field and plain-text content if suitable; this is a recommendation you can change.

If setup blocks you for 15 minutes, ask for targeted troubleshooting with the error and package versions; avoid rebuilding the stack repeatedly. Extension/EC is not assumed and this pack does not establish eligibility or submit a request. If circumstances warrant it, contact university support separately without waiting to continue work.

## First action

Dependencies, Stugit and PostgreSQL are now set up. Open **“You have installed the tools. What next?”** at the top of [BUILD-BLUEPRINT.md](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/assessment-guidance/BUILD-BLUEPRINT.md>). Enable DaisyUI, then write the public navbar and registration form yourself. Focus on that one screen before building the others.
