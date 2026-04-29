import { NextRequest } from "next/server";

import ip from "ip";

import { checkRateLimit } from "@/lib/services/redis-manager";

const IP_HEADER_CANDIDATES = [
  "x-forwarded-for",
  "cf-connecting-ip",
  "true-client-ip",
  "x-real-ip",
  "forwarded",
];

function normalizeIp(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim().replace(/^"|"$/g, "");

  if (trimmed.includes("for=")) {
    const forwardedFor = trimmed
      .split(";")
      .map((segment) => segment.trim())
      .find((segment) => segment.startsWith("for="));

    if (forwardedFor) {
      return forwardedFor.split("=")[1]?.trim().replace(/^"|"$/g, "") ?? null;
    }
  }

  return trimmed.split(",")[0].trim() || null;
}

export function getClientIp(request: NextRequest): string {
  for (const header of IP_HEADER_CANDIDATES) {
    const value = request.headers.get(header);
    const candidate = normalizeIp(value);

    if (candidate && (ip.isV4Format(candidate) || ip.isV6Format(candidate))) {
      return candidate;
    }
  }

  return "unknown";
}

export async function validateReviewRateLimit(
  request: NextRequest,
  userId: string
) {
  const clientIp = getClientIp(request);
  return checkRateLimit(userId, clientIp);
}
