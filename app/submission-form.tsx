"use client";

import { FormEvent, useState } from "react";

type Category = "question" | "issue";

export default function SubmissionForm() {
  const [category, setCategory] = useState<Category>("question");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        category,
        email: form.get("email"),
        subject: form.get("subject"),
        details: form.get("details"),
        website: form.get("website"),
      }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.error || "Something went wrong. Please try again.");
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="success" role="status">
        <div className="success-icon">✓</div>
        <h2>Received</h2>
        <p className="intro">Thank you. Your {category} has been added to the workshop list.</p>
        <button className="text-button" onClick={() => setStatus("idle")}>Submit another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="segment" aria-label="Submission type">
        <button type="button" className={category === "question" ? "active" : ""} onClick={() => setCategory("question")}>Workshop question</button>
        <button type="button" className={category === "issue" ? "active" : ""} onClick={() => setCategory("issue")}>Technical issue</button>
      </div>

      {status === "error" && <div className="message error" role="alert">{error}</div>}

      <div className="field">
        <label htmlFor="email">Your school email</label>
        <input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="name@daischina.net" maxLength={180} required />
      </div>

      <div className="field">
        <label htmlFor="subject">Short title</label>
        <input id="subject" name="subject" placeholder={category === "issue" ? "I can’t see my Grade 8 class" : "Question about progress report marks"} maxLength={140} required />
      </div>

      {category === "issue" && (
        <div className="examples">
          <strong>A helpful issue report sounds like this:</strong>
          <p>“I can’t log in using my school email.”</p>
          <p>“I can only see one of my classes.”</p>
          <p>“My Grade 8 marks won’t save. I see an error after pressing Submit.”</p>
        </div>
      )}

      <div className="field">
        <label htmlFor="details">{category === "issue" ? "What happened?" : "Your question"}</label>
        <textarea id="details" name="details" placeholder={category === "issue" ? "Start with “I can’t…” or “I tried…” and include the class or course." : "What would you like clarified during or after the workshop?"} maxLength={3000} required />
        <div className="hint">Please do not include passwords or sensitive student information.</div>
      </div>

      <div className="hp" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <button className="submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : `Submit ${category}`}</button>
    </form>
  );
}
