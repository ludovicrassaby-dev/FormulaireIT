export function getAllowedEmailDomains(): string[] {
  const raw =
    process.env.ALLOWED_EMAIL_DOMAINS || process.env.ALLOWED_EMAIL_DOMAIN || "";
  return raw
    .split(",")
    .map((domain) => domain.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);
}

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const domains = getAllowedEmailDomains();
  if (domains.length === 0) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return Boolean(domain && domains.includes(domain));
}

export function getCompanyName(): string {
  return process.env.NEXT_PUBLIC_COMPANY_NAME?.trim() || "votre organisation";
}

export function getPrimaryDomainHint(): string | undefined {
  return getAllowedEmailDomains()[0];
}

function publicHost(value: string): string {
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Canonical site URL for Auth.js (never localhost, never a random *.vercel.app deploy URL). */
export function applyVercelAuthUrl(): void {
  if (!process.env.VERCEL) return;

  const configured = process.env.AUTH_URL || "";
  if (configured && !/localhost|127\.0\.0\.1/i.test(configured)) {
    process.env.AUTH_URL = `https://${publicHost(configured)}`;
    return;
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? publicHost(process.env.VERCEL_PROJECT_PRODUCTION_URL)
    : "";
  const deployment = process.env.VERCEL_URL ? publicHost(process.env.VERCEL_URL) : "";
  const host = production || deployment;
  if (host) process.env.AUTH_URL = `https://${host}`;
}
