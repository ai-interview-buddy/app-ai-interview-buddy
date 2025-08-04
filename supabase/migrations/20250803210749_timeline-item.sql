create type public.timeline_type as enum (
  'COVER_LETTER',
  'NOTE',
  'CV_ANALYSE',
  'INTERVIEW_STEP',
  'INTERVIEW_ANALYSE'
);

create table public.timeline_item (
  id                             uuid            not null primary key default gen_random_uuid(),
  account_id                     uuid            not null references auth.users(id),
  position_id                    uuid            not null references public.job_position(id),
  title                          text            not null,
  type                           public.timeline_type not null,

  -- for COVER_LETTER / NOTE
  text                           text,

  -- for INTERVIEW_STEP
  interview_instructions         text,
  interview_scheduled_date       timestamptz,
  interview_interviewer_name     text,

  -- for INTERVIEW_ANALYSE
  interview_original_audio_path  text,
  interview_speech_to_text_path  text,
  interview_score                integer,

  created_at                     timestamptz     not null default now()
);

alter table public.timeline_item
  enable row level security;

create policy "Users can select own timeline items."
  on public.timeline_item
  for select
  using ((select auth.uid()) = account_id);

create policy "Users can insert own timeline items."
  on public.timeline_item
  for insert
  with check ((select auth.uid()) = account_id);

create policy "Users can update own timeline items."
  on public.timeline_item
  for update
  using ((select auth.uid()) = account_id);

create policy "Users can delete own timeline items."
  on public.timeline_item
  for delete
  using ((select auth.uid()) = account_id);
