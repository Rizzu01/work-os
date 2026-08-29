"use client";

import { useState } from "react";

const tasks = [
  { title: "KYC article and verification flow", project: "KYC Campaign", assignee: "RK", status: "In progress", priority: "High", due: "Today" },
  { title: "Crypto Digest carousel", project: "Content", assignee: "DS", status: "Review", priority: "Medium", due: "Aug 30" },
  { title: "Rakhi YouTube thumbnail", project: "Rakhi Campaign", assignee: "DS", status: "Completed", priority: "Low", due: "Aug 28" },
  { title: "Landing page copy review", project: "Website", assignee: "RK", status: "Not started", priority: "High", due: "Sep 01" },
  { title: "Weekly campaign performance", project: "Marketing", assignee: "AK", status: "In progress", priority: "Medium", due: "Sep 02" },
];

export default function Home() {
  const [view, setView] = useState<"list" | "board">("list");
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">WORK OS</div>
      <div className="workspace"><small>WORKSPACE</small><strong>Acme Workspace⌄</strong></div>
      <div className="nav-label">WORKSPACE</div>
      <nav className="nav"><a className="active" href="#">Home</a><a href="#">My Work</a><a href="#">Projects</a><a href="#">Reports</a><a href="#">Team</a></nav>
      <div className="nav-label" style={{marginTop:18}}>MANAGE</div>
      <nav className="nav"><a href="#">Inbox</a><a href="#">Calendar</a><a href="#">Settings</a></nav>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Workspace / Home</div><div className="top-actions"><input className="search" placeholder="Search tasks, projects..."/><div className="avatar">RK</div></div></header>
      <section className="content">
        <div className="headline"><div><div className="eyebrow">SATURDAY, AUGUST 29</div><h1>Good afternoon, Rizwan</h1><p>Here&apos;s what needs your attention today.</p></div><button className="primary">+ New task</button></div>
        <div className="stats"><div className="stat"><span>My open tasks</span><strong>8</strong></div><div className="stat"><span>Due today</span><strong>3</strong></div><div className="stat"><span>Completed this week</span><strong>24</strong></div><div className="stat"><span>Overdue</span><strong>2</strong></div></div>
        <div className="workspace-grid">
          <section className="panel"><div className="panel-head"><div><strong>My work</strong> <span className="muted"> · 8 tasks</span></div><div className="top-actions"><button className="primary" onClick={()=>setView(view === "list" ? "board" : "list")}>{view === "list" ? "Board" : "List"}</button></div></div>
            {view === "list" ? tasks.map((t,i)=><div className="task" key={i}><div className="check"/><div><div className="task-title">{t.title}</div><div className="project">{t.project}</div></div><div className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</div><div><span className={`pill ${t.status === "In progress" ? "progress" : t.status === "Review" ? "review" : t.status === "Completed" ? "done" : ""}`}>{t.status}</span></div><div className="muted">{t.due}</div></div>) : <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0}}>{["Not started","In progress","Review","Completed"].map(s=><div key={s} style={{borderRight:"1px solid #eee",minHeight:260}}><div className="panel-head"><strong>{s}</strong></div>{tasks.filter(t=>t.status===s).map((t,i)=><div className="side-item" key={i}><strong>{t.title}</strong><div>{t.project} · {t.priority}</div></div>)}</div>)}</div>}
          </section>
          <aside className="panel"><div className="panel-head"><strong>Today</strong><span className="muted">Aug 29</span></div><div className="side-list"><div className="side-item"><strong>3 tasks due today</strong><div>Prioritize these before end of day.</div></div><div className="side-item"><strong>2 overdue</strong><div>Review and reschedule anything blocked.</div></div><div className="side-item"><strong>Daily report</strong><div>Draft · 4 work items recorded</div></div></div></aside>
        </div>
      </section>
    </main>
  </div>;
}
