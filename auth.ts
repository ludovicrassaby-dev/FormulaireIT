import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getPrimaryDomainHint, isAllowedEmail } from "@/lib/env";

const googleClientId = process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;

async function refreshGoogleAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: googleClientId ?? "",
      client_secret: googleClientSecret ?? "",
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  const tokens = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    error?: string;
  };
  if (!response.ok || !tokens.access_token) {
    throw new Error(tokens.error || "Impossible de renouveler la session Google.");
  }
  return {
    accessToken: tokens.access_token,
    expiresAt: Math.floor(Date.now() / 1000) + (tokens.expires_in ?? 3600),
    refreshToken: tokens.refresh_token,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          include_granted_scopes: "true",
          scope:
            "openid email profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets",
          ...(getPrimaryDomainHint() ? { hd: getPrimaryDomainHint() } : {}),
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return isAllowedEmail(profile?.email);
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token ?? token.refreshToken;
        token.expiresAt = account.expires_at;
        delete token.error;
        return token;
      }

      if (typeof token.expiresAt === "number" && Date.now() < token.expiresAt * 1000 - 30_000) {
        return token;
      }

      if (typeof token.refreshToken !== "string") {
        token.error = "RefreshTokenError";
        return token;
      }

      try {
        const refreshed = await refreshGoogleAccessToken(token.refreshToken);
        token.accessToken = refreshed.accessToken;
        token.expiresAt = refreshed.expiresAt;
        if (refreshed.refreshToken) token.refreshToken = refreshed.refreshToken;
        delete token.error;
      } catch {
        token.error = "RefreshTokenError";
      }
      return token;
    },
    authorized({ auth: session, request }) {
      const isOnForm = request.nextUrl.pathname.startsWith("/formulaire");
      if (isOnForm) return Boolean(session?.user);
      return true;
    },
  },
});
