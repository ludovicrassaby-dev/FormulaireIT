import { createHmac, timingSafeEqual } from "crypto";

type SubmissionPayload = {
  folderId: string;
  email: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET manquant.");
  }
  return secret;
}

export function signSubmissionToken(folderId: string, email: string): string {
  const payload: SubmissionPayload = {
    folderId,
    email,
    exp: Date.now() + 1000 * 60 * 60,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifySubmissionToken(
  token: string,
  email: string,
): SubmissionPayload {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    throw new Error("Jeton d'envoi invalide.");
  }

  const expected = createHmac("sha256", getSecret()).update(body).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("Jeton d'envoi invalide.");
  }

  const payload = JSON.parse(
    Buffer.from(body, "base64url").toString("utf8"),
  ) as SubmissionPayload;

  if (payload.exp < Date.now()) {
    throw new Error("La session d'envoi a expiré. Recommencez la soumission.");
  }
  if (payload.email.toLowerCase() !== email.toLowerCase()) {
    throw new Error("Jeton d'envoi non associé à ce compte.");
  }

  return payload;
}
