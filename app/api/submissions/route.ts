import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/db";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.website) return NextResponse.json({ ok: true });

    const category = body.category === "issue" ? "issue" : body.category === "question" ? "question" : null;
    const email = String(body.email || "").trim().toLowerCase();
    const subject = String(body.subject || "").trim();
    const details = String(body.details || "").trim();

    if (!category || !emailPattern.test(email) || email.length > 180) {
      return NextResponse.json({ error: "Please enter a valid email and choose a submission type." }, { status: 400 });
    }
    if (subject.length < 3 || subject.length > 140 || details.length < 5 || details.length > 3000) {
      return NextResponse.json({ error: "Please add a short title and enough detail for me to understand it." }, { status: 400 });
    }

    const saved = await createSubmission({ category, email, subject, details });
    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("Submission failed", error);
    return NextResponse.json({ error: "The form could not be submitted. Please try again." }, { status: 500 });
  }
}
