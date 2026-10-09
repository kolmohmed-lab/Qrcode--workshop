import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, isCorrectAdminCode } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!isCorrectAdminCode(String(code || ""))) return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, adminToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 8 });
    return response;
  } catch (error) {
    console.error("Admin sign-in failed", error);
    return NextResponse.json(
      { error: "Admin access is not configured on this deployment." },
      { status: 500 },
    );
  }
}
