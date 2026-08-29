import type { SupabaseClient } from "@supabase/supabase-js";

export type Workspace = { id:string; name:string; slug:string; created_by:string|null; created_at:string };

export async function getUserWorkspace(client: SupabaseClient, userId: string) {
  const { data, error } = await client.from("workspace_members").select("workspace_id, workspaces!inner(id,name,slug,created_by,created_at)").eq("user_id", userId).limit(1).maybeSingle();
  if (error) throw error;
  const row = data as unknown as { workspace_id:string; workspaces: Workspace } | null;
  return row?.workspaces ?? null;
}
