insert into storage.buckets (id, name)
  values ('interviews', 'interviews');

create policy "Users can download own interviews."
  on storage.objects
  for select
  using (
    bucket_id = 'interviews'
    and owner = auth.uid()
  );

create policy "Users can upload own interviews."
  on storage.objects
  for insert
  with check (
    bucket_id = 'interviews'
    and owner = auth.uid()
  );

create policy "Users can update own interviews."
  on storage.objects
  for update
  using (
    bucket_id = 'interviews'
    and owner = auth.uid()
  )
  with check (
    bucket_id = 'interviews'
  );

create policy "Users can delete own interviews."
  on storage.objects
  for delete
  using (
    bucket_id = 'interviews'
    and owner = auth.uid()
  );
