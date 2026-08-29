-- Work OS core schema
-- Run this migration in the Supabase SQL editor before enabling production persistence.
create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  code text,
  color text not null default '#5865f2',
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null default 'Main board',
  created_at timestamptz not null default now()
);

create table if not exists public.board_groups (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  name text not null,
  position integer not null default 0
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  board_id uuid references public.boards(id) on delete set null,
  group_id uuid references public.board_groups(id) on delete set null,
  parent_task_id uuid references public.tasks(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'Not started',
  priority text not null default 'Medium',
  assignee_id uuid references auth.users(id) on delete set null,
  due_date date,
  position integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_workspace_idx on public.tasks(workspace_id);
create index if not exists tasks_project_idx on public.tasks(project_id);
create index if not exists tasks_assignee_idx on public.tasks(assignee_id);
create index if not exists tasks_due_date_idx on public.tasks(due_date);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.projects enable row level security;
alter table public.boards enable row level security;
alter table public.board_groups enable row level security;
alter table public.tasks enable row level security;

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.workspace_members wm where wm.workspace_id = target_workspace and wm.user_id = auth.uid());
$$;

create policy "workspace members can read workspaces" on public.workspaces for select using (public.is_workspace_member(id));
create policy "members can read membership" on public.workspace_members for select using (user_id = auth.uid() or public.is_workspace_member(workspace_id));
create policy "members can read projects" on public.projects for select using (public.is_workspace_member(workspace_id));
create policy "members can create projects" on public.projects for insert with check (public.is_workspace_member(workspace_id));
create policy "members can update projects" on public.projects for update using (public.is_workspace_member(workspace_id));
create policy "members can read boards" on public.boards for select using (exists(select 1 from public.projects p where p.id = project_id and public.is_workspace_member(p.workspace_id)));
create policy "members can manage boards" on public.boards for all using (exists(select 1 from public.projects p where p.id = project_id and public.is_workspace_member(p.workspace_id))) with check (exists(select 1 from public.projects p where p.id = project_id and public.is_workspace_member(p.workspace_id)));
create policy "members can manage groups" on public.board_groups for all using (exists(select 1 from public.boards b join public.projects p on p.id=b.project_id where b.id=board_id and public.is_workspace_member(p.workspace_id))) with check (exists(select 1 from public.boards b join public.projects p on p.id=b.project_id where b.id=board_id and public.is_workspace_member(p.workspace_id)));
create policy "members can read tasks" on public.tasks for select using (public.is_workspace_member(workspace_id));
create policy "members can create tasks" on public.tasks for insert with check (public.is_workspace_member(workspace_id));
create policy "members can update tasks" on public.tasks for update using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members can delete tasks" on public.tasks for delete using (public.is_workspace_member(workspace_id));
