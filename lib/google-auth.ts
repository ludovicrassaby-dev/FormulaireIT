import { google } from "googleapis";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { HttpError } from "@/lib/http";

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

const DRIVE_AND_SHEETS_SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
] as const;

function readServiceAccount(): ServiceAccount | null {
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (rawJson) {
    const parsed = JSON.parse(rawJson) as ServiceAccount;
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON incomplet.");
    }
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    };
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) return null;
  return { client_email: clientEmail, private_key: privateKey };
}

async function getSessionGoogleAuth() {
  const token = await getToken({
    req: { headers: await headers() },
    secret: process.env.AUTH_SECRET,
  });
  const accessToken = token?.accessToken;
  if (typeof accessToken !== "string" || !accessToken) {
    throw new HttpError(
      "Autorisez Drive et Sheets : déconnectez-vous, reconnectez-vous, puis acceptez l’accès demandé par Google.",
      401,
    );
  }

  const auth = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
  );
  auth.setCredentials({
    access_token: accessToken,
    refresh_token: typeof token.refreshToken === "string" ? token.refreshToken : undefined,
    expiry_date: typeof token.expiresAt === "number" ? token.expiresAt * 1000 : undefined,
  });
  return auth;
}

export async function getGoogleAuth() {
  const account = readServiceAccount();
  if (account) {
    return new google.auth.JWT({
      email: account.client_email,
      key: account.private_key,
      scopes: [...DRIVE_AND_SHEETS_SCOPES],
    });
  }
  return getSessionGoogleAuth();
}
