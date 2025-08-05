create table public.career_profile (
  id                uuid      not null primary key default gen_random_uuid(),
  account_id        uuid      not null references auth.users on delete cascade,
  title             text      not null,
  curriculum_path   text      not null,
  curriculum_text   text      not null,
  curriculum_score  integer      not null,
  curriculum_analyse text     not null,
  updated_at        timestamptz default now()
);

alter table public.career_profile
  enable row level security;

create policy "Users can select own career profiles."
  on public.career_profile
  for select
  using ((select auth.uid()) = account_id);

create policy "Users can insert own career profile."
  on public.career_profile
  for insert
  with check ((select auth.uid()) = account_id);

create policy "Users can update own career profile."
  on public.career_profile
  for update
  using ((select auth.uid()) = account_id);

create policy "Users can delete own career profile."
  on public.career_profile
  for delete
  using ((select auth.uid()) = account_id);

insert into storage.buckets (id, name)
  values ('curriculums', 'curriculums');

create policy "Users can download own CVs."
  on storage.objects
  for select
  using (
    bucket_id = 'curriculums'
    and owner = auth.uid()
  );

create policy "Users can upload own CVs."
  on storage.objects
  for insert
  with check (
    bucket_id = 'curriculums'
    and owner = auth.uid()
  );

create policy "Users can update own CVs."
  on storage.objects
  for update
  using (
    bucket_id = 'curriculums'
    and owner = auth.uid()
  )
  with check (
    bucket_id = 'curriculums'
  );

create policy "Users can delete own CVs."
  on storage.objects
  for delete
  using (
    bucket_id = 'curriculums'
    and owner = auth.uid()
  );
