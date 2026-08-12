import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { upsertAdminProfile } from "@/lib/api/admin-client";

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const profile = await upsertAdminProfile({
    bio: body.bio != null ? String(body.bio) : undefined,
    avatar_url: body.avatar_url ?? undefined,
    resume_url: body.resume_url ?? undefined,
    letter_url: body.letter_url ?? undefined,
  });
  return NextResponse.json(profile);
}
