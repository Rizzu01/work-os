create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member','guest')),
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  key text,
  description text,
  color text,
  owner_id uuid references auth.users(id) on delete set null,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null default 'Main Board',
  created_at timestamptz not null default now()
);

create table if not exists public.board_groups (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  name text not null,
  position integer not null default 0,
  color text,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  board_id uuid references public.boards(id) on delete set null,
  group_id uuid references public.board_groups(id) on delete set null,
  parent_task_id uuid references public.tasks(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'not_started' check (status in ('not_started','in_progress','review','completed','blocked')),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  assignee_id uuid references auth.users(id) on delete set null,
  due_date date,
  position integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_workspace on public.projects(workspace_id);
create index if not exists idx_tasks_workspace on public.tasks(workspace_id);
create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_parent on public.tasks(parent_task_id);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.projects enable row level security;
alter table public.boards enable row level security;
alter table public.board_groups enable row level security;
alter table public.tasks enable row level security;

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.workspace_members wm where wm.workspace_id = target_workspace and wm.user_id = auth.uid()); $$;

create policy "members can read workspaces" on public.workspaces for select using (public.is_workspace_member(id));
create policy "users can create workspaces" on public.workspaces for insert with check (created_by = auth.uid());
create policy "members can read membership" on public.workspace_members for select using (user_id = auth.uid() or public.is_workspace_member(workspace_id));
create policy "owners can manage membership" on public.workspace_members for all using (exists (select 1 from public.workspace_members x where x.workspace_id = workspace_members.workspace_id and x.user_id = auth.uid() and x.role in ('owner','admin'))) with check (exists (select 1 from public.workspace_members x where x.workspace_id = workspace_members.workspace_id and x.user_id = auth.uid() and x.role in ('owner','admin')));
create policy "members can manage projects" on public.projects for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members can manage boards" on public.boards for all using (exists (select 1 from public.projects p where p.id = boards.project_id and public.is_workspace_member(p.workspace_id))) with check (exists (select 1 from public.projects p where p.id = boards.project_id and public.is_workspace_member(p.workspace_id)));
create policy "members can manage groups" on public.board_groups for all using (exists (select 1 from public.boards b join public.projects p on p.id=b.project_id where b.id=board_groups.board_id and public.is_workspace_member(p.workspace_id))) with check (exists (select 1 from public.boards b join public.projects p on p.id=b.project_id where b.id=board_groups.board_id and public.is_workspace_member(p.workspace_id)));
create policy "members can manage tasks" on public.tasks for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
