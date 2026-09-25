# Test Case Manager (Vue + Supabase)

Small test-management app: projects → suites → sub-suites → test cases, each with create/edit/delete forms, status badges and breadcrumbs, stored in Supabase through a shared `useCrud` composable.

مدیریت تست‌کیس‌ها با Vue و Supabase.

## Stack
Vue 3 · Vite · Supabase JS

## Run
```bash
npm install
npm run dev
```
Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (read in `src/lib/supabase.js`).
