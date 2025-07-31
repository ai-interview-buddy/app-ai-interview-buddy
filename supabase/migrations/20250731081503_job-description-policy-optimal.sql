DROP POLICY IF EXISTS "Users can manage own job positions" ON public.job_position;

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
