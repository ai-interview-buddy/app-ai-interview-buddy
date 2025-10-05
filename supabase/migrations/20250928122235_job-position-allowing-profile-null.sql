alter table public.job_position
  drop constraint job_position_career_profile_id_fkey;

alter table public.job_position
  alter column career_profile_id drop not null;

alter table public.job_position
  add constraint job_position_career_profile_id_fkey
  foreign key (career_profile_id)
  references public.career_profile (id)
  on delete set null;
