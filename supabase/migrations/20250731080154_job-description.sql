create table public.job_position (
  id                 uuid        not null primary key default gen_random_uuid(),
  account_id         uuid        not null references auth.users(id),
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

create policy "Users can manage own job positions"
  on public.job_position
  using (account_id = auth.uid())
  with check (account_id = auth.uid());
