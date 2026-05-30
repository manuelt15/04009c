import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Subscriber } from "@/lib/models/subscriber";
import { requireAdmin } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    await connectDB();
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ subscribers });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
