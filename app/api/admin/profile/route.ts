import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { upsertAdminProfile } from "@/lib/api/admin-client";

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const profile = await upsertAdminProfile({ bio: String(body.bio ?? "") });
  return NextResponse.json(profile);
}
