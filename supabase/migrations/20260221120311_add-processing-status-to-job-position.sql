create type public.processing_status as enum (
  'PENDING', 
  'PROCESSING', 
  'COMPLETED', 
  'FAILED'
);

alter table public.job_position add column processing_status public.processing_status not null default 'COMPLETED';

alter table public.job_position add column raw_job_description text;
