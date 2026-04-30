import { describe, expect, it } from "vitest";

import { getClientIp } from "@/lib/middleware/rate-limit";

const createRequest = (headerName: string, headerValue: string) => ({
  headers: {
    get(name: string) {
      return name === headerName ? headerValue : null;
    },
  },
});

describe("getClientIp", () => {
  it("extracts the first IP from x-forwarded-for", () => {
    const request = createRequest(
      "x-forwarded-for",
      "203.0.113.1, 198.51.100.2"
    );
    expect(getClientIp(request as any)).toBe("203.0.113.1");
  });

  it("reads CF-Connecting-IP when provided", () => {
    const request = createRequest("cf-connecting-ip", "198.51.100.3");
    expect(getClientIp(request as any)).toBe("198.51.100.3");
  });

  it("returns unknown when no valid IP header exists", () => {
    const request = createRequest("x-custom-header", "not-an-ip");
    expect(getClientIp(request as any)).toBe("unknown");
  });
});
