import Link from "next/link";
import { Monitor } from "lucide-react";
import { auth, signOut } from "@/auth";
import { getCompanyName } from "@/lib/env";

export async function SiteHeader(props: { variant?: "default" | "solid" }) {
  const session = await auth();
  const company = getCompanyName();
  const isSolid = props.variant === "solid";

  return (
    <header
      className={`sticky top-0 z-40 border-b ${
        isSolid
          ? "border-line bg-card/95 backdrop-blur"
          : "border-transparent bg-bg/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-card">
            <Monitor className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg tracking-tight">{company}</span>
            <span className="block text-xs uppercase tracking-[0.18em] text-muted">
              Inventaire matériel
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/formulaire"
                className="rounded-full px-4 py-2 text-forest-soft hover:bg-bg-deep"
              >
                Formulaire
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full px-4 py-2 text-muted hover:bg-bg-deep hover:text-ink"
                >
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/connexion"
              className="rounded-full bg-forest px-4 py-2 text-card hover:bg-forest-soft"
            >
              Accéder au formulaire
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
