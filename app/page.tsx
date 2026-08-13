import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { auth } from "@/auth";
import { BrandLogo } from "@/components/brand-logo";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { PageShell } from "@/components/page-shell";
import { getAllowedEmailDomains, getCompanyName } from "@/lib/env";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/formulaire");

  const params = await searchParams;
  const domains = getAllowedEmailDomains();
  const domainLabel =
    domains.length > 0
      ? domains.map((domain) => `@${domain}`).join(", ")
      : "votre domaine professionnel";

  return (
    <PageShell headerVariant="solid">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-16">
        <BrandLogo size={72} className="h-[72px] w-[72px]" />
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-accent">
          {getCompanyName()}
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">Connexion</h1>
        <p className="mt-3 text-muted">
          Compte professionnel {domainLabel} obligatoire. Google demandera l’accès à Drive
          et à la feuille de réponses pour enregistrer la déclaration.
        </p>
        {params.error ? (
          <div className="mt-6 flex gap-3 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            <p>Connexion refusée. Utilisez un compte {domainLabel}.</p>
          </div>
        ) : null}
        <div className="mt-8 rounded-[24px] border border-line bg-card p-6">
          <GoogleSignInButton
            callbackUrl={params.callbackUrl || "/formulaire"}
            label="Se connecter pour ouvrir le formulaire"
          />
        </div>
      </main>
    </PageShell>
  );
}
