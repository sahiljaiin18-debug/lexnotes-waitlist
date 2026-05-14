# LexNotes Waitlist — Supabase + Gmail SMTP

Mobile-first LexNotes waitlist page with buyer/seller signup paths.

## What is already integrated
- Supabase project URL
- Supabase anon key
- Supabase table name: `waitlist_signups`
- Gmail sender: `info.lexnotes@gmail.com`

## What must NOT be committed to GitHub
Do not hardcode the Gmail App Password into the repo.
Add it only inside Vercel Environment Variables.

## Vercel Environment Variable
Add this in Vercel → Project → Settings → Environment Variables:

EMAIL_APP_PASSWORD = your Gmail app password

## Supabase SQL
Run this once in Supabase SQL Editor:

```sql
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  intent text not null check (intent in ('buyer', 'seller')),
  name text not null,
  email text not null unique,
  college text,
  year_sem text,
  confirmation_email_sent boolean default false,
  launch_email_sent boolean default false
);
```

## Deploy
```bash
npm install
npm run build
```
Then push to GitHub and import into Vercel.
