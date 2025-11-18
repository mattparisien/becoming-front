import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Minimal validation
  const { name, email, topic, message } = body || {};
    if (!name || !email || !topic || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    // TODO: wire up email service or CRM here
    // For now, just return a fake id
    const id = Math.random().toString(36).slice(2);

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
}
