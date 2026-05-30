import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Subscriber } from "@/lib/models/subscriber";
import { sendSubscriberConfirmation, sendOwnerNotification } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name   = typeof body.name   === "string" ? body.name.trim()   : null;
    const email  = typeof body.email  === "string" ? body.email.trim().toLowerCase() : null;
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const city   = typeof body.city   === "string" ? body.city.trim()   : "";

    if (!name || !email) {
      return NextResponse.json({ error: "NOMBRE Y EMAIL REQUERIDOS" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "EMAIL INVÁLIDO" }, { status: 400 });
    }

    await connectDB();

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "EMAIL YA REGISTRADO" }, { status: 409 });
    }

    await Subscriber.create({ name, email, mobile, city });

    // Emails en paralelo — si fallan no bloquean el registro
    Promise.all([
      sendSubscriberConfirmation(email, name),
      sendOwnerNotification({ name, email, mobile, city }),
    ]).catch(() => {});

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
