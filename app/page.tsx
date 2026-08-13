import { auth } from "@/auth";
import {
  LandingCta,
  LandingFacts,
  LandingHero,
  LandingSteps,
} from "@/components/landing/home-sections";
import { PageShell } from "@/components/page-shell";
import { getAllowedEmailDomains, getCompanyName } from "@/lib/env";

export default async function HomePage() {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user);
  const domainHint = getAllowedEmailDomains()[0] || "votre-domaine.fr";

  return (
    <PageShell>
      <main>
        <LandingHero companyName={getCompanyName()} isAuthenticated={isAuthenticated} />
        <LandingSteps />
        <LandingFacts />
        <LandingCta domainHint={domainHint} isAuthenticated={isAuthenticated} />
      </main>
    </PageShell>
  );
}
