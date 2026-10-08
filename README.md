# Toddle with Ayman — workshop questions

A mobile-first question and issue form for the DAIS & DHS Toddle workshop. Submissions are stored in Neon Postgres and reviewed through a server-protected admin page.

## Pages

- `/` — participant form and QR-code destination
- `/admin` — private results page

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add a pooled Neon connection string as `DATABASE_URL`.
4. Set `ADMIN_CODE` to the private workshop access code.
5. Run `npm run dev`.

The table is created automatically on the first request. The SQL migration is also available in `migrations/001_workshop_questions.sql`.

## GitHub and Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel as a Next.js project.
3. Add `DATABASE_URL` and `ADMIN_CODE` to Vercel for Production, Preview and Development.
4. Deploy and use the production homepage URL as the QR-code destination.

Keep `.env.local` out of Git. The admin code is checked by a server route and is never included in browser JavaScript.
