create table public.job_position (
  id                 uuid        not null primary key default gen_random_uuid(),
  account_id         uuid        not null references auth.users(id) on delete cascade,
  career_profile_id  uuid        not null references public.career_profile(id),
  company_name       text        not null,
  company_logo       text,
  company_website    text,
  job_url            text,
  job_title          text        not null,
  job_description    text        not null,
  salary_range       text,
  expected_salary    text,
  offer_received     boolean     not null default false,
  archived           boolean     not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.job_position enable row level security;

create policy "Users can select own job positions."
  on public.job_position
  for select
  using ((select auth.uid()) = account_id);

create policy "Users can insert own job position."
  on public.job_position
  for insert
  with check ((select auth.uid()) = account_id);

create policy "Users can update own job position."
  on public.job_position
  for update
  using ((select auth.uid()) = account_id);

create policy "Users can delete own job position."
  on public.job_position
  for delete
  using ((select auth.uid()) = account_id);
