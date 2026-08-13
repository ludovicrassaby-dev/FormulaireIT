import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { HardwareForm } from "@/components/hardware-form/hardware-form";
import { PageShell } from "@/components/page-shell";
import { getPublicCatalog } from "@/lib/agencies";
import { sessionHasGoogleDriveAccess } from "@/lib/google-session";

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
        {!sessionHasGoogleDriveAccess(session) ? (
          <div className="mt-8 rounded-[24px] border border-danger/30 bg-danger/10 p-6">
            <p className="font-medium">Accès Google Drive / Sheets manquant</p>
            <p className="mt-2 text-sm text-muted">
              Reconnectez-vous et acceptez l’accès à Drive et à la feuille de
              réponses. Sans ça, la déclaration ne peut pas être enregistrée.
            </p>
            <div className="mt-5 max-w-md">
              <GoogleSignInButton
                callbackUrl="/formulaire"
                label="Reconnecter le compte Google"
              />
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </PageShell>
  );
}
