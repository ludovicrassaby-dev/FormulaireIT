import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getPrimaryDomainHint, isAllowedEmail } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
          ...(getPrimaryDomainHint() ? { hd: getPrimaryDomainHint() } : {}),
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return isAllowedEmail(profile?.email);
    },
    authorized({ auth: session, request }) {
      const isOnForm = request.nextUrl.pathname.startsWith("/formulaire");
      if (isOnForm) return Boolean(session?.user);
      return true;
    },
  },
});
