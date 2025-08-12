create type public.question_type as enum (
  'BEHAVIORAL',
  'TECHNICAL',
  'BACKGROUND_EXPERIENCE',
  'GREETING_OR_CHIT_CHAT'
);

create type public.question_format as enum (
  'DEEPGRAM'
);

create table public.interview_question (
  id                        uuid not null primary key default gen_random_uuid(),
  account_id                uuid not null references auth.users on delete cascade,
  timeline_item_id          uuid not null references public.timeline_item(id) on delete cascade,
  
  question_number           int not null,
  question_type             public.question_type not null,
  question_title            text not null,
  question_format           public.question_format not null,
  question_json             text not null, 
  
  question_start_second     numeric,
  answer_start_second       numeric,
  
  structure                 int,
  relevance                 int,
  clarity_conciseness       int,
  specificity_detail        int,
  actions_contribution      int,
  results_impact            int,
  competency_demonstration  int,
  score                     int,

  feedback                  text,

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

alter table public.interview_question
  enable row level security;

create policy "Users can select own interview questions."
  on public.interview_question
  for select
  using ((select auth.uid()) = account_id);

create policy "Users can insert own timeline items."
  on public.interview_question
  for insert
  with check ((select auth.uid()) = account_id);

create policy "Users can update own timeline items."
  on public.interview_question
  for update
  using ((select auth.uid()) = account_id);

create policy "Users can delete own timeline items."
  on public.interview_question
  for delete
  using ((select auth.uid()) = account_id);
