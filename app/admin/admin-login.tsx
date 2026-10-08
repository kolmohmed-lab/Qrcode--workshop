"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const code = new FormData(event.currentTarget).get("code");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }) });
    if (!response.ok) { setStatus("error"); return; }
    router.refresh();
  }

  return <form onSubmit={submit}>{status === "error" && <div className="message error">That access code is not correct.</div>}<div className="field"><label htmlFor="code">Access code</label><input id="code" name="code" type="password" autoComplete="current-password" required /></div><button className="submit" disabled={status === "sending"}>{status === "sending" ? "Checking…" : "View responses"}</button></form>;
}
