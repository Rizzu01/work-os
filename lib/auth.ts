import type { WorkspaceRole } from "./types";
export type SessionUser = { id:string; email:string; role:WorkspaceRole };
export const AUTH_ROLES: WorkspaceRole[] = ["owner","admin","member"];
export function isWorkspaceAdmin(role: WorkspaceRole){return role === "owner" || role === "admin";}
