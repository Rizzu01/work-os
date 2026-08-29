export type TaskStatus = "Not started" | "In progress" | "Review" | "Completed";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type WorkspaceRole = "owner" | "admin" | "member";

export type Workspace = { id: string; name: string; slug: string };
export type Project = { id: string; workspaceId: string; name: string; code: string | null; color: string; ownerId: string | null };
export type Board = { id: string; projectId: string; name: string };
export type BoardGroup = { id: string; boardId: string; name: string; position: number };
export type Subtask = { id: string; parentTaskId: string; title: string; completed: boolean };
export type Task = { id: string; workspaceId: string; projectId: string | null; boardId: string | null; groupId: string | null; parentTaskId: string | null; title: string; description: string; status: TaskStatus; priority: Priority; assigneeId: string | null; dueDate: string | null; position: number; createdBy: string | null };
