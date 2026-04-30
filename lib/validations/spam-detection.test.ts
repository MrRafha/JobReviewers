import { describe, expect, it } from "vitest";

import { detectSpam } from "@/lib/validations/spam-detection";

describe("detectSpam", () => {
  it("flags content with more than two URLs as spam", () => {
    const content = "https://a.com https://b.com https://c.com test";
    const result = detectSpam(content);

    expect(result.isSpam).toBe(true);
    expect(result.reason).toContain("Links em massa");
    expect(result.hash).toHaveLength(64);
  });

  it("flags content with repeated characters as spam", () => {
    const content = "Hello!!!!!!!!!!!";
    const result = detectSpam(content);

    expect(result.isSpam).toBe(true);
    expect(result.reason).toContain("Caracteres repetidos");
  });

  it("does not flag normal review text as spam", () => {
    const content =
      "This review is honest, detailed, and contains no spam patterns.";
    const result = detectSpam(content);

    expect(result.isSpam).toBe(false);
    expect(result.reason).toBeUndefined();
  });
});
