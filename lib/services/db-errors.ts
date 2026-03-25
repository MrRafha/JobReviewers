type ErrorWithCode = Error & {
  code?: string;
  cause?: unknown;
};

const TRANSIENT_DB_CODES = new Set([
  "ETIMEDOUT",
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
]);

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const typedError = error as ErrorWithCode;
  const message = (typedError.message || "").toLowerCase();
  const code = (typedError.code || "").toUpperCase();

  if (TRANSIENT_DB_CODES.has(code)) {
    return true;
  }

  if (
    message.includes("etimedout") ||
    message.includes("can't reach database server") ||
    message.includes("connection") && message.includes("timed out")
  ) {
    return true;
  }

  if (typedError.cause && isDatabaseUnavailableError(typedError.cause)) {
    return true;
  }

  return false;
}