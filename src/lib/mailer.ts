import nodemailer from "nodemailer";

const esc = (s: string) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendSubscriberConfirmation(to: string, name: string) {
  await transporter.sendMail({
    from: `"04009c — The House of Access" <${process.env.MAIL_USER}>`,
    to,
    subject: "// SOLICITUD RECIBIDA — 04009c",
    html: `
      <div style="background:#04009c;padding:48px 32px;font-family:monospace;color:#E2E2E2;max-width:480px;margin:0 auto;">
        <p style="font-size:11px;letter-spacing:0.2em;color:#FF0000;text-transform:uppercase;margin:0 0 24px;">// REGISTRO CONFIRMADO</p>
        <h1 style="font-size:32px;color:#E2E2E2;letter-spacing:0.3em;margin:0 0 24px;">04009c</h1>
        <p style="font-size:14px;line-height:1.7;color:rgba(226,226,226,0.8);margin:0 0 16px;">
          Hola ${esc(name)},
        </p>
        <p style="font-size:14px;line-height:1.7;color:rgba(226,226,226,0.8);margin:0 0 32px;">
          Tu solicitud de acceso ha sido recibida. Te contactaremos cuando tu acceso esté listo.
        </p>
        <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:24px;">
          <p style="font-size:10px;letter-spacing:0.15em;color:rgba(240,165,0,0.5);text-transform:uppercase;margin:0;">
            The House of Access — 04009c
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendOwnerNotification(subscriber: {
  name: string;
  email: string;
  mobile: string;
  city: string;
}) {
  await transporter.sendMail({
    from: `"04009c Admin" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    subject: "// NUEVO SUSCRIPTOR — 04009c",
    html: `
      <div style="background:#080808;padding:48px 32px;font-family:monospace;color:#E2E2E2;max-width:480px;margin:0 auto;">
        <p style="font-size:11px;letter-spacing:0.2em;color:#FF0000;text-transform:uppercase;margin:0 0 24px;">// NUEVO SUSCRIPTOR</p>
        <table style="width:100%;border-collapse:collapse;">
          ${[
            ["NOMBRE", esc(subscriber.name)],
            ["EMAIL",  esc(subscriber.email)],
            ["MÓVIL",  esc(subscriber.mobile || "—")],
            ["CIUDAD", esc(subscriber.city   || "—")],
          ].map(([label, value]) => `
            <tr>
              <td style="font-size:10px;letter-spacing:0.15em;color:#FF0000;text-transform:uppercase;padding:8px 0 4px;">${label}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#E2E2E2;padding:0 0 16px;border-bottom:1px solid #2A2A2A;">${value}</td>
            </tr>
          `).join("")}
        </table>
      </div>
    `,
  });
}
