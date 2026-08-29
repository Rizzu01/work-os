create or replace function public.create_workspace(workspace_name text, workspace_slug text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare new_workspace_id uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if length(trim(workspace_name)) < 2 then raise exception 'Workspace name is too short'; end if;
  if length(trim(workspace_slug)) < 2 then raise exception 'Workspace slug is too short'; end if;
  insert into public.workspaces(name, slug, created_by)
  values (trim(workspace_name), lower(trim(workspace_slug)), auth.uid())
  returning id into new_workspace_id;
  insert into public.workspace_members(workspace_id, user_id, role)
  values (new_workspace_id, auth.uid(), 'owner');
  return new_workspace_id;
exception when unique_violation then
  raise exception 'That workspace slug is already in use';
end;
$$;

grant execute on function public.create_workspace(text,text) to authenticated;
