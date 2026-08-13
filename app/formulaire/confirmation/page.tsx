import Link from "next/link";
import { CheckCircle2, FolderOpen } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ agency?: string; region?: string }>;
}) {
  const params = await searchParams;
  const locationLabel =
    params.region && params.agency ? ` pour ${params.agency} (${params.region})` : "";

  return (
    <PageShell headerVariant="solid">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-16">
        <CheckCircle2 className="h-12 w-12 text-forest" />
        <h1 className="mt-4 font-serif text-4xl tracking-tight">Déclaration enregistrée</h1>
        <p className="mt-4 leading-relaxed text-muted">
          Merci. Les informations{locationLabel} et les pièces jointes ont été
          déposées dans le dossier Drive de l&apos;agence.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/formulaire"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm text-card hover:bg-forest-soft"
          >
            Déclarer une autre agence
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-5 py-3 text-sm hover:bg-bg-deep"
          >
            <FolderOpen className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
