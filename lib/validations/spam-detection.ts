import crypto from "crypto";

const URL_REGEX = /https?:\/\/[^\s]+/gi;
const REPEATED_CHARACTER_REGEX = /(.)\1{10,}/;
const MAX_REVIEW_LENGTH = 1500;
const MIN_REVIEW_LENGTH = 40;

export type SpamDetectionResult = {
  isSpam: boolean;
  reason?: string;
  hash: string;
};

export function hashReviewContent(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function detectSpam(content: string): SpamDetectionResult {
  const normalized = content.trim();
  const urlMatches = normalized.match(URL_REGEX) || [];
  const reasons: string[] = [];

  if (urlMatches.length > 2) {
    reasons.push("Links em massa");
  }

  if (REPEATED_CHARACTER_REGEX.test(normalized)) {
    reasons.push("Caracteres repetidos");
  }

  if (normalized.length > MAX_REVIEW_LENGTH || normalized.length < MIN_REVIEW_LENGTH) {
    reasons.push("Comprimento anormal");
  }

  return {
    isSpam: reasons.length > 0,
    reason: reasons.length > 0 ? reasons.join(", ") : undefined,
    hash: hashReviewContent(normalized),
  };
}
