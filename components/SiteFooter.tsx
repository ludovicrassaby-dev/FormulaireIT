import { getCompanyName } from "@/lib/env";

export function SiteFooter() {
  const company = getCompanyName();

  return (
    <footer className="mt-auto border-t border-line bg-bg-deep">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Campagne interne · {company}</p>
        <p>Connexion réservée aux comptes professionnels. Les pièces jointes sont déposées sur Drive, par agence.</p>
      </div>
    </footer>
  );
}
