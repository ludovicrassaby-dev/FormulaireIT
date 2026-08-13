import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { HardwareForm } from "@/components/hardware-form/hardware-form";
import { PageShell } from "@/components/page-shell";
import { getPublicCatalog } from "@/lib/agencies";

export default async function FormulairePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/connexion");

  return (
    <PageShell headerVariant="solid">
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
          Déclaration manager
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight">Identifier le matériel inutilisé</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Choisissez la région puis l&apos;agence. Pour chaque poste, remplissez
          les zones : nom Windows, Koesio, SOS Réseau, n° de série, et l&apos;état
          (aspect + fonctionnement). Les réponses sont enregistrées dans Drive et
          dans une Google Sheet.
        </p>
        <HardwareForm
          regions={getPublicCatalog()}
          userName={session.user.name || "Manager"}
          userEmail={session.user.email}
        />
      </main>
    </PageShell>
  );
}
