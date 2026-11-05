# Written implementation blueprint

AI planning material only. No executable skeleton is supplied. **Chosen: Auth.js Credentials.** You chose it to keep things simple. Follow the numbered setup steps below first; the later tables are reference material. Simpler state without Redux is your stated preference.

## 1. Get the project running: do these steps in order

These are instructions for you to execute, not commands I have run. Stop after each **check**. You do not need to read the later component tables yet.

### Step 1 — Create your Stugit repository

Suggested name: **cmp6057a-001-newsletter**. No mandatory assessment naming convention was found in the brief or Git lab; this is a descriptive recommendation. Use your assigned Stugit account and a private repository. Avoid generating a remote README/gitignore for an otherwise empty remote, to avoid an unnecessary merge with your local project. Check lecturer access as described in the Git lab (username `jc`); the lab's group-work instructions do not turn this into a group assessment.

Keep the remote URL Stugit provides. You will connect it after generating the app. Do not use a lecturer's teaching repository as your remote.

**Check:** you can open your own empty repository on Stugit.

### Step 2 — Generate the Next application

The current coursework folder name contains spaces and capitals. Generate a sensibly named child folder rather than asking the scaffolder to use that folder name as the npm package name:

```sh
cd '/home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter'
npx create-next-app@16 newsletter-cms --use-npm
cd newsletter-cms
npm run dev
```

This uses the Next16 major consistent with the taught proxy convention, rather than floating across future major releases. Choose custom settings if prompted: **TypeScript yes; ESLint; React Compiler no; Tailwind yes; src directory no; App Router yes; default @/* import alias**. Keep the generated lockfile. Node on this machine was v22.19.0 when checked.

Open http://localhost:3000. Keep this terminal running; open a second terminal in `newsletter-cms` for other commands. Ctrl+C stops the development server.

**Check:** the starter page loads. The app root is now `001 Newsletter/newsletter-cms`; all following project commands run there. This is framework-generated scaffolding, not AI-written application code. Reference: Lab3.0 pp3–6; [create-next-app options](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Step 3 — Connect that app to Stugit

Run `git status` inside `newsletter-cms`. The scaffold normally initialises Git. If it says no Git repository exists, initialise one there. Review the generated ignore file: `.env`/real secrets, `node_modules` and `.next` must stay excluded; later explicitly allow your secret-free `.env.example` if the generated pattern ignores it.

Commit the generated project, set the branch to main, and add the **exact remote URL supplied by your own Stugit repo** as origin. Then push main and verify the files online. Lab0.2 pp6–12 walks through init/add/commit/remote/push; use your own URL, not its sample. If an origin already exists, inspect it first rather than adding a duplicate. Keep the guidance/context directories outside this repository.

**Check:** Stugit displays this app's package.json and lockfile. No secret values appear.

### Step 4 — Create a local database user and database

Read-only inspection found PostgreSQL18 already running on localhost:5432 on your Arch machine. **Do not run initdb or reinstall it.** A connection as OS user `zekiah` failed because that database role does not exist. Create a separate app role/database instead.

Run these once in a terminal, using your local administrator password when sudo asks:

```sh
sudo -iu postgres createuser --pwprompt --no-superuser --no-createdb --no-createrole newsletter_app
sudo -iu postgres createdb --owner=newsletter_app newsletter_db
psql -h 127.0.0.1 -U newsletter_app -d newsletter_db -W -c 'SELECT 1;'
```

The first command asks you to **choose a new database password**. The last asks for that same password. The role and database names above are recommendations; if either already exists, stop and inspect rather than dropping/replacing it. These commands create project resources but do not change existing databases. If administrator access fails, stop and ask for help with the error; do not alter global authentication settings blindly.

**Check:** the final command returns a row containing `1`. GUI setup in Lab4.1 pp2–3 is an alternative, not an extra requirement. Official references: [createuser](https://www.postgresql.org/docs/current/app-createuser.html), [createdb](https://www.postgresql.org/docs/current/app-createdb.html).

### Step 5 — Initialise Prisma and connect it to that database

Inside `newsletter-cms`, install the Prisma7 family used by the lab:

```sh
npm install @prisma/client@7 @prisma/adapter-pg@7 pg dotenv
npm install -D prisma@7 @types/pg
npx prisma init --datasource-provider postgresql
```

In the app root's private `.env`, set DATABASE_URL to the connection URL for `newsletter_app`, your chosen password, host `127.0.0.1`, port `5432`, database `newsletter_db`. URL shape: `postgresql://USER:PASSWORD@127.0.0.1:5432/newsletter_db`. Replace USER and PASSWORD; URL-encode special characters in the password. Do not paste the actual value into chat or commit it.

Inspect the generated root `prisma.config.ts`: it must load environment variables and read DATABASE_URL. Inspect `prisma/schema.prisma`: PostgreSQL datasource and a generated-client output/import that you understand. Follow Lab4.1 pp4–8 for the server Prisma client and adapter pattern; do not copy a Prisma6 example into this Prisma7 setup. You write the required User/Newsletter models using section 2 below, then run:

```sh
npx prisma validate
npx prisma db push
npx prisma generate
```

For this initial local workflow, `db push` avoids Prisma migrate-dev's separate shadow-database privilege requirement. This is allowed by the brief's setup examples; it synchronises the schema but does not generate migration history. If you choose migrations later, configure a separate shadow database or suitable local development permissions first. Never respond to an unexpected data-loss prompt by accepting it without understanding it.

**Check:** schema validates, the two related tables exist and client generation succeeds. This is the point to write the small server-only Prisma client module yourself. Do not build newsletter screens until the database connection works. Read [Prisma7 configuration guidance](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7) if config/imports differ from the slides.

### Step 6 — Add Auth.js and minimal DaisyUI

```sh
npm install next-auth@beta bcryptjs zod
npm install -D daisyui@5
openssl rand -base64 32
```

Put the last command's generated value into your private `.env` under AUTH_SECRET. Do not copy slide secrets. Follow Lab5 Part2 pp29–38 for Auth.js Credentials; implement registration/password hashing yourself, then let Auth.js own the session. Google is deferred.

Tailwind comes from the scaffold. Follow Lab3.0 pp5–6/DaisyUI's [Next installation](https://daisyui.com/docs/install/nextjs/) for the CSS plugin declaration. **Tailwind and DaisyUI are required by brief p2.** Use your own layout/colours/spacing and only a few DaisyUI controls if you dislike its look. There is no stated minimum number of components, but merely installing an unused package is weaker evidence than actually using it. Omitting it requires lecturer agreement to avoid the stated stack risk.

**Check:** a control you styled with DaisyUI renders; next implement registration → login → logout before starting dashboard CRUD.

## Reference: the files you will write as you build

Proposed structure, described rather than created:

| Location | Responsibility |
|---|---|
| `app/layout.tsx`, `app/globals.css` | Global shell, navbar and styling; provider boundary only where needed |
| `app/page.tsx` | Minimal public landing page/link to public feed |
| `app/(auth)/register/page.tsx`, `app/(auth)/login/page.tsx` | Public registration/login; route group adds no URL segment |
| `app/newsletters/page.tsx` | Server-side public Sent-only list; include full content here to avoid needing a detail route initially |
| `app/dashboard/page.tsx` | Server-verified own-newsletter list; explicit Create button; viewing full own content is sufficient initially |
| `app/dashboard/create/page.tsx`, `app/dashboard/edit/[id]/page.tsx` | Protected create/edit screens; load existing record only under ownership constraint |
| `app/components/` | Navbar, reusable NewsletterForm, NewsletterCard, pending submit control; create only these when used |
| `app/lib/prisma.ts`, `app/lib/newsletters.ts`, `app/lib/validation.ts` | Server database client; owner-scoped queries; shared runtime input rules |
| `app/actions/newsletters.ts` | Create/update/delete server actions; each independently verifies session/ownership |
| `prisma/schema.prisma`, `prisma.config.ts` | Required models; Prisma 7 CLI/database configuration |
| `.env.example`, `.gitignore`, `README.md`, lockfile | You write setup/env-key documentation; exclude real secrets and build/dependency output |

No classes, service layer hierarchy or general-purpose CMS framework are needed. Suggested module/file names are recommendations, not rubric requirements. Public `[id]` details can be added later using [Lab 3.1](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/assessment-guidance/sources/02-3.1.Next-continue-RTK.pdf>), pp5–8, but must query by both id and Sent status.

## 2. Data and interfaces

| Data shape | Fields / meaning |
|---|---|
| User | id, unique email, optional name, password hash, createdAt, updatedAt; one-to-many newsletters |
| Newsletter | id, title, content stored as Text, image stored as Text, status restricted to Draft/Schedule/Sent with Draft default, authorId foreign key, createdAt, updatedAt |
| Safe session user | Stable database user id, name/email for display; never password/hash or secret |
| Newsletter form input | title, content, image URL, status; update/delete also take a record id; **never accept authorId as authority** |
| Form result | Validation errors or a safe failure/success outcome; pending state in UI; never raw database error/stack trace |

Choose one compatible id type and use it consistently across Prisma, route parameters and the session. Map the database user id into the verified session: Auth.js session types do not magically establish ownership. Use the generated model types where useful; avoid maintaining duplicate interfaces for every database field.

Recommendations: plain text rendered as text rather than raw HTML; a URL field rather than image upload; sensible length bounds; allowed image protocols/hosts; default Draft on create. Validate on the server even if browser fields also validate. If using bcrypt, consider its input byte limit rather than silently truncating long passwords. Do not impose a required name merely because a lab form does.

## 3. Authentication decision

### Chosen: Auth.js Credentials

Use [Lab 5](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/assessment-guidance/sources/01-5.0-Auth-custom-credentials-Auth.js.pdf>), Part 2 pp29–38, supported by [Lab 4.0](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/assessment-guidance/sources/01-4.0-Next-Auth.pdf>), pp12–17. Registration stays yours: validate, check unique email, hash password, persist user, then guide to login. Auth.js Credentials performs database lookup and password comparison through `authorize`; choose JWT session strategy explicitly. Auth.js handles its session cookies and login/logout machinery.

Additional responsibilities/files: root `auth.ts` (provider/session configuration), `app/api/auth/[...nextauth]/route.ts` (Auth.js handlers), `app/api/auth/register/route.ts` (your validated registration endpoint), password helper in `app/lib/`, session type augmentation if required, and `app/components/Providers.tsx` with SessionProvider if using client `useSession` in Navbar. Login form uses Auth.js signIn; logout uses its signOut and refresh/redirect appropriate to the UI. Use `AUTH_SECRET`, not the unrelated secret name the lab's CLI screenshot initially generates. No manual JWT signing library is required on this path.

Credentials-only does not need OAuth Account/Session models or a Prisma Auth.js adapter just to look up your own User table. If Google is later chosen, revisit persistence/schema and JWT strategy rather than mixing an adapter's defaults blindly. Registration/password hashing are not performed for you by Credentials.

## 4. Server operations and ownership

Proposed API is internal server functions/actions, not a second public REST newsletter API. If you choose route handlers instead, apply exactly the same checks inside those handlers.

| Operation | Server rule and result |
|---|---|
| List dashboard | Verified session required; database filter authorId = session user id |
| Read own record | Verified session; query by id **and** authorId; absent or not owned gives safe not-found/denial |
| Create | Verify session, validate fields; set authorId from session, not request |
| Update/status change | Verify session, validate id/fields/status; constrain write by id and authorId; no update if not owned |
| Delete | Verified owner-scoped mutation; no destructive GET; confirm in UI to reduce mistakes |
| List public | Database query status = Sent; project public fields only; never send Draft/Schedule to browser and hide there |

Use the same server identity helper for all protected operations. An ownership query must enforce the write, not just hide a button. A dashboard layout check is useful but does not replace checks at data access and mutations. Revalidate affected dashboard/public paths after changes. Avoid global caching of personalised queries; ensure public filtering remains correct after status changes.

Guard `/dashboard` and descendants using version-appropriate middleware/proxy. In Next 16 this is `proxy.ts`; earlier versions use `middleware.ts`. Leave `/`, `/newsletters`, `/login`, `/register`, required auth callbacks and static assets public. Cookie **presence** is not signature verification. The Week 5 p101 screenshot uses presence checks and excludes API routes; it is insufficient as the only security layer.

## 5. Small client surface and finishing

Keep database reads in server components. Use local state for form input/errors/pending interactions. For server action forms use the Week 4 lecture pp63–64 `useActionState`/`useFormStatus` pattern. Auth display state follows the chosen session source; React context or Redux must never authorise a server operation. Your reason for avoiding Redux is limited learning time, not a claim that Redux is bad.

Use semantic labels/buttons, DaisyUI form controls/cards, responsive spacing, readable status badges, visible errors, loading/pending feedback and empty-state create link. An image fallback/alt text helps usability. Do not add unrelated books/people routes, a working subscribe feature, email delivery or a theme system simply because a lab shows a button.

At each milestone run the matching checks in [DECISIONS-AND-CHECKS.md](</home/zekiah/Projects/CMP/CMP-6057A (Advanced Web Development)/001 Newsletter Context/assessment-guidance/DECISIONS-AND-CHECKS.md>). After the feature freeze, write the submission README and diagram yourself from the system you actually built.
