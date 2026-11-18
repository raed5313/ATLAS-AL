-- ATLAS AI project storage schema
create extension if not exists pgcrypto;

create table if not exists public.atlas_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'مشروع جديد',
  description text not null default '',
  instructions text not null default '',
  template text not null default 'blank'
    check (template in ('admin','store','company','dashboard','blank')),
  files jsonb not null default '[]'::jsonb,
  stage text not null default 'idea'
    check (stage in ('idea','plan','design','build','deploy')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists atlas_projects_user_updated_idx
  on public.atlas_projects(user_id, updated_at desc);

alter table public.atlas_projects enable row level security;

drop policy if exists "Users can read own ATLAS projects" on public.atlas_projects;
create policy "Users can read own ATLAS projects"
  on public.atlas_projects for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create own ATLAS projects" on public.atlas_projects;
create policy "Users can create own ATLAS projects"
  on public.atlas_projects for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own ATLAS projects" on public.atlas_projects;
create policy "Users can update own ATLAS projects"
  on public.atlas_projects for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own ATLAS projects" on public.atlas_projects;
create policy "Users can delete own ATLAS projects"
  on public.atlas_projects for delete to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.atlas_projects to authenticated;
