import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { PageShell } from "@/components/page-shell";
import { getAllowedEmailDomains, getCompanyName } from "@/lib/env";

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/formulaire");

  const params = await searchParams;
  const domains = getAllowedEmailDomains();
  const domainLabel =
    domains.length > 0 ? domains.map((domain) => `@${domain}`).join(", ") : "votre domaine professionnel";

  return (
    <PageShell headerVariant="solid">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
          Accès managers · {getCompanyName()}
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">Connexion obligatoire</h1>
        <p className="mt-4 text-muted leading-relaxed">
          Le formulaire n&apos;est accessible qu&apos;avec un compte professionnel
          Google ({domainLabel}). Les comptes personnels Gmail sont refusés.
        </p>
        {params.error ? (
          <div className="mt-6 flex gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p>
              Connexion refusée. Utilisez un compte {domainLabel}. Si le problème
              continue, contactez l&apos;équipe informatique.
            </p>
          </div>
        ) : null}
        <div className="mt-8 rounded-[24px] border border-line bg-card p-6">
          <GoogleSignInButton callbackUrl={params.callbackUrl || "/formulaire"} />
          <p className="mt-4 text-center text-xs text-muted">
            En vous connectant, votre nom et votre e-mail professionnel sont
            associés à la déclaration déposée dans Drive.
          </p>
        </div>
      </main>
    </PageShell>
  );
}
