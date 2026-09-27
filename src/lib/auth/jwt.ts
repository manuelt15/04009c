import { SignJWT, jwtVerify } from "jose";

const MEMBER_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_MEMBER!);
const ADMIN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_ADMIN!);

export async function signMemberToken(): Promise<string> {
  return new SignJWT({ role: "member" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(MEMBER_SECRET);
}

export async function verifyMemberToken(token: string) {
  const { payload } = await jwtVerify(token, MEMBER_SECRET);
  return payload;
}

export async function signAdminToken(adminId: string): Promise<string> {
  return new SignJWT({ role: "admin", sub: adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(ADMIN_SECRET);
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, ADMIN_SECRET);
  return payload;
}
