import { cookies } from "next/headers";
import Link from "next/link";
import { ADMIN_COOKIE, hasValidAdminToken } from "@/lib/admin";
import { listSubmissions } from "@/lib/db";
import AdminLogin from "./admin-login";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authorized = hasValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);

  if (!authorized) {
    return (
      <main className="site-shell">
        <section className="glass admin-login">
          <header className="brand-strip"><div><div className="brand-context">Private view</div><div className="brand-name">Toddle with Ayman</div></div><div className="brand-mark" /></header>
          <div className="panel"><div className="eyebrow">Workshop responses</div><h1>Admin<br />access</h1><p className="intro">Enter the access code to view submitted questions and issues.</p><AdminLogin /></div>
        </section>
      </main>
    );
  }

  const rows = await listSubmissions();
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><div className="eyebrow">Toddle with Ayman</div><h1>Workshop responses</h1><p className="intro">{rows.length} submission{rows.length === 1 ? "" : "s"}, newest first.</p></div>
        <div style={{ display: "flex", gap: 8 }}><Link href="/">Open form</Link><LogoutButton /></div>
      </header>
      <section className="results">
        {rows.length === 0 ? <div className="empty">No questions yet. The newest submissions will appear here.</div> : rows.map((row) => {
          const created = new Date(String(row.created_at));
          return <article className="result-card" key={String(row.id)}><div className="result-top"><span className={`badge ${row.category === "issue" ? "issue" : ""}`}>{String(row.category)}</span><time>{created.toLocaleString("en-GB", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short" })}</time></div><h2>{String(row.subject)}</h2><p>{String(row.details)}</p><div className="meta"><span>{String(row.email)}</span><span>Reference #{String(row.id)}</span></div></article>;
        })}
      </section>
    </main>
  );
}
