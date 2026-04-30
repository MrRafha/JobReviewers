import { describe, expect, it } from "vitest";

import { hashIp } from "@/lib/services/redis-manager";

describe("hashIp", () => {
  it("returns a 12-character hashed key for an IP address", () => {
    const hashed = hashIp("192.168.0.1");

    expect(hashed).toHaveLength(12);
    expect(hashed).toMatch(/^[0-9a-f]{12}$/);
  });

  it("returns stable output for the same input", () => {
    const first = hashIp("2001:0db8:85a3::8a2e:0370:7334");
    const second = hashIp("2001:0db8:85a3::8a2e:0370:7334");

    expect(first).toBe(second);
  });
});
