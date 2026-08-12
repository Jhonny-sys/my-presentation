import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateAdminI18nEntry } from "@/lib/api/admin-client";

type Params = { params: Promise<{ key: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const body = await request.json();
  const entry = await updateAdminI18nEntry(decodeURIComponent(key), body);
  return NextResponse.json(entry);
}
