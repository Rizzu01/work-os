export type TaskStatus = "Not started" | "In progress" | "Review" | "Completed";
export type Priority = "Low" | "Medium" | "High";

export type Task = {
  id: string;
  title: string;
  projectId: string;
  group: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  due: string;
  description: string;
  subtasks: { id: string; title: string; completed: boolean }[];
};

export type Project = {
  id: string;
  name: string;
  code: string;
  color: string;
  owner: string;
};

const KEY = "work-os-v1";
const seed = {
  projects: [
    { id: "kyc", name: "KYC Campaign", code: "KYC", color: "#7c5cff", owner: "RK" },
    { id: "crypto", name: "Crypto Marketing", code: "CM", color: "#eea900", owner: "AK" },
    { id: "rakhi", name: "Rakhi Campaign", code: "RC", color: "#df5c7a", owner: "DS" },
    { id: "website", name: "Website Redesign", code: "WR", color: "#2b8a78", owner: "RK" },
  ] as Project[],
  tasks: [
    { id: "t1", title: "KYC article and verification flow", projectId: "kyc", group: "Launch", status: "In progress" as TaskStatus, priority: "High" as Priority, assignee: "RK", due: "Today", description: "", subtasks: [] },
    { id: "t2", title: "Create supporting social creatives", projectId: "kyc", group: "Launch", status: "Not started" as TaskStatus, priority: "Medium" as Priority, assignee: "DS", due: "Aug 30", description: "", subtasks: [] },
    { id: "t3", title: "Legal copy review", projectId: "kyc", group: "Review", status: "Review" as TaskStatus, priority: "High" as Priority, assignee: "AK", due: "Aug 31", description: "", subtasks: [] },
    { id: "t4", title: "Publish final article", projectId: "kyc", group: "Review", status: "Not started" as TaskStatus, priority: "Low" as Priority, assignee: "RK", due: "Sep 02", description: "", subtasks: [] },
  ] as Task[],
};

export function loadWorkspace() {
  if (typeof window === "undefined") return seed;
  try { return JSON.parse(localStorage.getItem(KEY) || "null") || seed; } catch { return seed; }
}
export function saveWorkspace(data: typeof seed) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(data));
}
