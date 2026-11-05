# Requirements and evidence

AI learning guidance only. Source of assessment obligations: [Brief v4](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Assessment/Assessment briefs/001 - Web Application Project Brief/ultraDocumentBody/_6068079_1/01-001-Advanced-Web-Development-v4.pdf>); rubric weights are on p7. Every row below has an observable check. Recommendations do not create additional university requirements.

## Minimum requirements: 50% combined

| ID / category | Required behaviour and source | Milestone | Evidence to demonstrate |
|---|---|---|---|
| R1 Registration — 5% | `/register`: guest creates account with email/password and optional name; strong password handling (p2 §1) | 2 | Register without a name; reject invalid inputs/duplicate email; demonstrate password hash without exposing it or secrets |
| R2 Sessions/auth — within 15% security | Auth.js or custom credentials; robust sessions; logout cleans cookie/application state and redirects (p2 §2a–b) | 2 | Good/bad credentials; reload persists valid login; expired/invalid session rejected; logout then direct dashboard access denied |
| R3 Routes/endpoints — within 15% security | Dashboard and all descendants strictly protected; all endpoints secure; whole site outside dashboard public; middleware/proxy guarding (p2 §2c–e and overview) | 2–3 | Guest opens dashboard URLs and directly attempts protected reads/writes; denial occurs server-side; public pages still load |
| R4 Navigation — within security | Guest gets login/register; authenticated user gets dashboard link, name/email and logout; login/register links hidden (p3 §2f) | 2 | Show navbar before/after login, reload and logout; hidden links alone are not protection |
| R5 Schema — 5% | PostgreSQL/Prisma User has id/email/name/password/createdAt/updatedAt (credentials or OAuth profile); Newsletter has id/title/content Text/image Text/status/authorId/createdAt/updatedAt; one user to many newsletters; Draft default (p3 §3) | 1–3 | Explain schema, foreign key, default and actual persisted ownership |
| R6 Isolation — within 15% dashboard | Only own newsletters on dashboard; never view/edit/delete another user's newsletters (p3 §4a) | 3 | User B attempts A's private record by changing id and by direct operation; no data leak or modification |
| R7 CRUD — within 15% dashboard | Explicit Create Newsletter button; viewing, editing, deleting and status updates among Draft/Schedule/Sent (p3 §4b–c) | 3 | Create, reload, view, edit, change each status, delete; explain author identity comes from server session |
| R8 Publishing — within dashboard/feed | Sent newsletters automatically appear publicly (p3 §4d) | 4 | Set Sent, visit public feed; set back to Draft, confirm disappearance |
| R9 Public feed — 5% | `/newsletters` available without login; only Sent records; Draft/Schedule invisible (p3 §5) | 4 | Guest feed with all three statuses in database; optional public details also filter Sent server-side |
| R10 Structure/practices — 5% | Rubric category; quality, best practice, usability and aesthetics judged in recorded demonstration (p4, p7) | All | Explain small modules, typed inputs, runtime validation, no secret exposure; useful error/pending/empty states |
| R11 Stack — constraint | TypeScript, Next.js App Router, PostgreSQL+Prisma, accepted auth, Tailwind+DaisyUI; other stacks may be penalised (pp1–2) | 1 | Explain dependencies and demonstrate running application; do not use the Week 2 Vite project as the final framework |

Weight is per rubric category, not per row. Subdivisions above carry no invented individual percentages.

## Deliverables and defence

| ID | Requirement / source | Acceptance check |
|---|---|---|
| D1 | Maximum 15-minute `.mp4`; working features, requirements and implementation approach; lessons optional (p5 §1a) | File plays with legible screen and audible explanation; show real behaviour rather than only source |
| D2 | Single-page PDF workflow architecture, e.g. class single-/three-branch architecture (p5 §1b) | One page; describes your actual chosen flow, browser/server/auth/database and public/private boundaries |
| D3 | Source in CMP Stugit before deadline; README with setup/auth approach/environment template without values (p5 §2) | Remote contains latest source, dependency lockfile and required configuration; another person can follow setup |
| D4 | Seed or sample credentials optional but recommended (p5 §3) | Either documented disposable test accounts that actually work or a seed you wrote; avoid personal passwords |
| D5 | Compulsory in-person viva, code/application ready (pp4–5) | Confirm slot, rehearse questions and small change; start app beforehand |
| D6 | Own intellectual work; correct attribution and full acknowledgement of AI contribution ([Submission guidance](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Summative Assessment/{001}{CMP-6057A-26-SEM1-A}/_6115945_1/01-submission guidance.md>)) | Your own accurate acknowledgement and attribution; pack/code/assets excluded from submission |

The assessment is 60% of the module (brief p1); the table percentages are within Assessment 001. The postgraduate report/template and p8 report rubric do not apply to you.

## Ambiguities and interpretation limits

- **Schedule:** p3 requires a status named `Schedule`; no minimum `scheduledAt` field, scheduler or publication-time rule is given. Recommendation: implement the status, keep it private; defer automation unless clarified. This is an interpretation, not lecturer confirmation.
- **Sent:** p3 explicitly makes Sent public. No minimum subscriber model, SMTP transport or mail delivery workflow is specified. Recommendation: treat it as publication; do not add email sending without a reason.
- **Isolation/publication:** p3 requires public Sent records and private dashboard isolation. Reconcile these by allowing guest reads of Sent public content while protecting every dashboard record and every mutation by ownership. Another user's published record is public only through the public interface.
- **Secure endpoints:** registration/login and public feed must remain reachable by guests. Secure means appropriate validation and permissions, not requiring login for every URL.
- **Architecture labels:** the brief mentions single-/three-branch; Week 5 p17 onward compares auth approaches and flows. Do not confuse these with Git branches, invent a required number of branches, or depict three auth systems you did not implement. Ask the lecturer if an exact diagram convention matters.
- **Q&A:** exported link has no posts; its target `_5793770_1` returned “Session expired or access denied” through Chalk. No discussion clarification verified. Original [Assessment Q&A](https://learn.uea.ac.uk/ultra/courses/_158570_1/outline?contentId=_5793789_1) remains a manual check.
