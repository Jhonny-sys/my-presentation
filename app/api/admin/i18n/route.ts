import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminI18nEntry } from "@/lib/api/admin-client";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const entry = await createAdminI18nEntry(body);
  return NextResponse.json(entry, { status: 201 });
}
