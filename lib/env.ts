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
