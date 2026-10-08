import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "toddle_workshop_admin";

function configuredCode() {
  const code = process.env.ADMIN_CODE;
  if (!code) throw new Error("ADMIN_CODE is not configured");
  return code;
}

export function isCorrectAdminCode(candidate: string) {
  const expected = Buffer.from(configuredCode());
  const received = Buffer.from(candidate);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function adminToken() {
  return createHmac("sha256", configuredCode())
    .update("toddle-workshop-admin-v1")
    .digest("hex");
}

export function hasValidAdminToken(candidate?: string) {
  if (!candidate) return false;
  const expected = Buffer.from(adminToken());
  const received = Buffer.from(candidate);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
