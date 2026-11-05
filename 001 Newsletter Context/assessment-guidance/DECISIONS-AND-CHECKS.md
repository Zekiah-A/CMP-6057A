# Decisions, checks and defence preparation

AI learning guidance. This is a working record, not text to submit. Only actual user statements are recorded as reasons. Empty/pending decisions remain yours.

## Decisions as of this conversation

| Item | State | Your stated reason / next choice |
|---|---|---|
| CMP-6057A | Confirmed | You confirmed undergraduate cohort. |
| Deadline | Plan against 6 Nov 15:00 | You do not know how to authorise an extension; no approved extension is assumed. |
| Time | Up to six hours | Your selected working budget includes submission. |
| Assistance boundary | Confirmed | Written blueprint only; you implement; no AI code/assets in final submission. |
| Client state | Simpler structure; no Redux unless a concrete need emerges | You said you do not know Redux and cannot effectively learn it in time. |
| Auth | **Confirmed: Auth.js Credentials** | You said: “I will go auth.js then, just to be simple.” Earlier context: Custom sounds fun, fits your interests and feels uniquely yours; you are comfortable implementing JWT and asked whether it has a marking advantage. You are willing to use Auth.js if custom adds no benefit. |
| Auth recommendation | Auth.js Credentials, now chosen | Brief permits both and specifies no method bonus. Under six hours, reducing session machinery leaves more time for ownership checks and demonstrable quality. You still implement signup/hash/lookup/authorisation. |
| Server operations | Proposed server reads/actions, pending confirmation | Your preference supports simplicity; no specific action-vs-REST choice was explicitly confirmed. |
| Optional features | Not chosen | Core first; you expressed interest in later custom+Google and asked about email 2FA. These are not approved commitments. |
| DaisyUI | Required stack; minimal use proposed | You dislike DaisyUI and asked whether it is avoidable. Brief p2 lists it explicitly; no omission agreed. |
| Repository name | Recommended cmp6057a-001-newsletter | No prescribed assessment naming rule found. |
| Image/content UI | Proposed URL and plain text | Keeps scope small; confirm when implementing the form. |

Authentication choice is now confirmed. Auth.js is not inherently awarded more marks; custom could score equally well. Evidence is the brief p2 accepted methods and p4/p7 quality-based judging, not a prediction of an individual marker's preference.

## Optional features: value versus time

Estimates below are rough additional implementation/test time after a working core, not university figures. No separate marks per desirable are published ([Brief v4](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Assessment/Assessment briefs/001 - Web Application Project Brief/ultraDocumentBody/_6068079_1/01-001-Advanced-Web-Development-v4.pdf>), p4).

| Desirable | Likely coverage / cost | Decision recommendation |
|---|---|---|
| Usability feedback | Desirable §7 plus core usability; 15–30 min for pending/errors/empty states/confirmation | Highest fit; build a small coherent amount during core work |
| External public feed | §5; 30–60 min plus remote failures, data mapping and attribution | Consider only after core; distinguish remote articles from your own Sent feed; no auth tokens needed for a public feed |
| Share interaction | Part of §6; 10–25 min for link copy/share UI | Small candidate, but share alone does not establish like/comment/share coverage or guarantee marks |
| Google plus Credentials | §1; 45–90+ min for Auth.js integration and tests, longer if custom hybrid | Only if core is finished and provider setup works; account persistence/identity/linking/logout need care |
| Roles/admin/moderator | §4; 45–90+ min; define useful permissions and enforce server-side | Defer; ordinary ownership is required but is not itself RBAC |
| Like/comment | §6; 60–120+ min; schema, access, validation and abuse handling | Defer in six-hour plan |
| Passwordless | §3; 60–120+ min; delivery/provider, single-use expiry, failure handling | Defer |
| 2FA | §2; 90–180+ min; enrolment/challenge/expiry/replay/attempt limits and recovery | Defer; SMTP alone does not provide a secure second-factor flow |

For the external-feed option, the brief names US-RSE newsletters JSON, dev.to articles and Daring Fireball JSON feed. Those endpoints were not live-tested; select and verify one only if you choose this extra. Do not build all of them.

## Acceptance checks to perform yourself

Create two disposable accounts A and B and records covering Draft, Schedule and Sent. Use separate browser profiles/sessions. Record actual pass/fail; none of these checks has been run against your future application.

| Check | Action and expected result | Criteria |
|---|---|---|
| Signup | Valid email/password with no name works; malformed email, weak password and duplicate email fail safely; no plaintext persisted | R1,R5 |
| Login | Correct login succeeds; wrong/unknown credentials fail without secrets; response does not unnecessarily reveal account existence | R1,R2 |
| Session | Reload works while valid; missing, expired and tampered sessions fail; forged cookie name/value never grants data access | R2,R3 |
| Cookie | Inspect HttpOnly, path, SameSite and production Secure; no session token in localStorage or client-readable cookie | R2 |
| Logout | Cookie removed, navbar updated, redirect appropriate; back/reload/direct operation cannot regain protected data | R2,R4 |
| Guest routes | `/`, `/newsletters`, `/login`, `/register` accessible; `/dashboard`, create and edit URL denied without session | R3 |
| Direct operations | Repeat protected request/server action without valid session using browser Network/request tools; no data returned or changed | R3 |
| Ownership | A creates private record; B cannot list/view/edit/delete/change status using A's id, including direct calls and forged authorId | R6,R7 |
| CRUD | Create button visible; view/edit/status/delete persist across reload; invalid status rejected server-side | R5,R7 |
| Publishing | Guest sees Sent only; Draft/Schedule absent from response, not just hidden; moving Sent to Draft removes it after refresh | R8,R9 |
| Public isolation | A's Sent content is public; its dashboard edit/delete remain private to A; optional public detail of Draft/Schedule is unavailable | R6,R9 |
| UI | Pending prevents repeat submits, errors useful, empty list explains next step, keyboard labels and narrow-screen layout usable | R10 |
| Source/setup | No `.env` secrets, password/hash displays or tokens in logs; lockfile/config/schema included; README setup works | R10,D3 |
| Build | Run supplied build, TypeScript and lint scripts if present; inspect failures; do not invent a passing result or blindly rewrite config | R10,D3 |

A JWT tampering test should alter the token value, not merely remove a cookie. With Auth.js use its own session handling; do not assume its token is a plaintext JWT suitable for a JWT decoder. Keep active tokens out of external decoder sites and recordings.

## Recording and submission

Suggested coverage order, **not a script**: guest feed and denied dashboard → register/login/navbar → create/view/edit/status/delete → second-user isolation/direct request denial → schema, verified session and ownership design → any completed extras → setup and limitations. Aim for 8–12 minutes if that is sufficient; 15 minutes is a maximum, not a target. Show real outcomes and enough source to explain why access is denied.

Your own diagram should identify browser/public/private interactions, authentication/session verification, server actions or endpoints, database relation, and publication filtering. Match the system you built. No finished diagram is supplied here.

- [ ] Write your own README: prerequisite versions/PostgreSQL access, installation, env keys, client generation/schema setup, run commands, authentication approach, disposable test setup and known limitations.
- [ ] Write a secret-free `.env.example`: DATABASE_URL and the auth path's secret; Google keys only if used. Keep true values excluded.
- [ ] Attribute university examples/assets and acknowledge the actual AI planning/explanation assistance in your own words ([Submission guidance](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Summative Assessment/{001}{CMP-6057A-26-SEM1-A}/_6115945_1/01-submission guidance.md>)). Guidance-only use still counts as assistance.
- [ ] MP4 plays, audio is clear, duration ≤15 minutes; no credentials/secrets visible. PDF is readable and exactly one page.
- [ ] Push before deadline and verify latest commit/files on your own CMP Stugit remote. Confirm any required marker access; do not substitute personal GitHub.
- [ ] Upload MP4 and PDF to correct CMP-6057A submission point; verify files by opening them and save receipt. Inspect actual attempt limits early; generic guidance says latest submission is marked.
- [ ] Confirm viva time/location from [Published viva schedule](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/advanced-web-development/Assessment/Assessment briefs/001 - Viva slots/ultraDocumentBody/_6068087_1/01-6057-7057 001 VIVA slots-v3.pdf>); be set up before your slot.

## Viva practice after submitting

Practice aloud without a prepared answer from this pack: where is the password hashed and compared; what authenticates a request; how is session user id established; why does hiding a link not protect an operation; how do you prevent changing another user's newsletter; what happens after logout/expiry; why are public records filtered on the server; why did you choose your auth/state approach?

Try one five-minute modification on your own code: add a validation rule and feedback, change dashboard sorting, or display another safe field. Explain affected files and test behaviour. The exact live change is unknown. Be honest about incomplete features and JWT revocation/session limits.
