-- Add processing_status and raw_job_description columns for Trigger.dev background enrichment
alter table public.job_position
  add column processing_status text default 'COMPLETED',
  add column raw_job_description text;
