import {
  Building2,
  Camera,
  CheckCircle2,
  FolderLock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export function LandingHero(props: {
  companyName: string;
  isAuthenticated: boolean;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-forest/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Campagne interne · {props.companyName}
          </p>
          <h1 className="font-serif text-4xl leading-[1.12] tracking-tight text-ink sm:text-6xl">
            Retrouver les ordinateurs
            <span className="italic text-forest"> qui ne servent plus.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Ce formulaire est destiné aux managers. Pour chaque poste inutilisé :
            région, agence, nom Windows, n° Koesio s&apos;il existe, référence
            SOS Réseau le cas échéant, et n° de série (saisi ou photographié).
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {props.isAuthenticated ? (
              <Link
                href="/formulaire"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_-12px_rgba(179,58,22,0.7)] hover:bg-accent-dark"
              >
                Ouvrir le formulaire
              </Link>
            ) : (
              <div className="w-full sm:w-auto">
                <GoogleSignInButton label="S’identifier pour remplir le formulaire" />
              </div>
            )}
            <p className="text-sm text-muted sm:ml-2">Compte professionnel obligatoire.</p>
          </div>
        </div>
        <LandingPreview />
      </div>
    </section>
  );
}

function LandingPreview() {
  return (
    <aside className="relative">
      <div className="rounded-[28px] border border-line bg-card p-6 shadow-[0_30px_80px_-40px_rgba(28,23,18,0.45)]">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Aperçu du classement</p>
          <span className="rounded-full bg-bg-deep px-3 py-1 text-xs text-forest">
            Drive par agence
          </span>
        </div>
        <div className="space-y-3">
          <PreviewRow icon={MapPin} label="Région" value="Haute-Normandie" />
          <PreviewRow icon={Building2} label="Agence" value="Rouen" />
          <PreviewRow icon={FolderLock} label="Dossier Drive" value="Rouen / 2026-08-13_marie-dupont" />
          <PreviewRow icon={Camera} label="Pièces jointes" value="S/N, étiquettes, synthèse" />
        </div>
        <div className="mt-6 rounded-2xl bg-forest px-5 py-4 text-card">
          <p className="font-serif text-xl">Un dossier précis, automatiquement.</p>
          <p className="mt-1 text-sm text-white/75">
            Le choix de la région puis de l&apos;agence détermine le dossier Drive
            dans lequel tout est enregistré.
          </p>
        </div>
      </div>
    </aside>
  );
}

function PreviewRow(props: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  const Icon = props.icon;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-bg/60 px-4 py-3">
      <Icon className="mt-0.5 h-4 w-4 text-accent" />
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">{props.label}</p>
        <p className="text-sm font-medium">{props.value}</p>
      </div>
    </div>
  );
}

export function LandingSteps() {
  return (
    <section className="border-y border-line bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
        <Step
          number="01"
          title="Connexion SSO"
          text="Authentifiez-vous avec votre compte professionnel Google. Les comptes personnels sont refusés."
        />
        <Step
          number="02"
          title="Région, puis agence"
          text="Sélectionnez d’abord la région : la liste des agences se met à jour. C’est ce choix qui oriente le dossier Drive."
        />
        <Step
          number="03"
          title="Déclaration et photos"
          text="Pour chaque poste : nom Windows, n° Koesio s’il existe, référence SOS Réseau le cas échéant, n° de série saisi ou photographié."
        />
      </div>
    </section>
  );
}

function Step(props: { number: string; title: string; text: string }) {
  return (
    <div>
      <p className="font-serif text-4xl text-gold">{props.number}</p>
      <h2 className="mt-3 font-serif text-2xl">{props.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{props.text}</p>
    </div>
  );
}

export function LandingFacts() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">Pourquoi cette campagne</h2>
          <p className="mt-4 text-muted leading-relaxed">
            Des ordinateurs restent dans des armoires, des bureaux vacants ou des
            salles de réunion. L’objectif est d’en faire un inventaire fiable,
            agence par agence, pour les réaffecter, les recycler ou les sortir du
            parc.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          <Fact title="Qui remplit ?" text="Les managers de chaque agence, ou la personne qui connaît le matériel sur site." />
              <Fact title="Quoi photographier ?" text="Le n° de série constructeur (S/N) s’il n’est pas lisible, plus le poste à son emplacement." />
          <Fact title="Et s’il n’y en a pas ?" text="Vous pouvez confirmer qu’aucun ordinateur n’est inutilisé. C’est tout aussi utile." />
          <Fact title="Où vont les fichiers ?" text="Uniquement dans le dossier Drive de l’agence sélectionnée, dans un sous-dossier daté à votre nom." />
        </ul>
      </div>
    </section>
  );
}

function Fact(props: { title: string; text: string }) {
  return (
    <li className="rounded-2xl border border-line bg-card p-5">
      <p className="flex items-center gap-2 font-medium">
        <CheckCircle2 className="h-4 w-4 text-forest" />
        {props.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{props.text}</p>
    </li>
  );
}

export function LandingCta(props: {
  domainHint: string;
  isAuthenticated: boolean;
}) {
  return (
    <section className="px-5 pb-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[28px] bg-forest px-8 py-10 text-card md:flex-row md:items-center">
        <div>
          <h2 className="font-serif text-3xl">Prêt à déclarer le matériel de votre agence ?</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
            <ShieldCheck className="h-4 w-4" />
            Accès restreint aux comptes @{props.domainHint}
          </p>
        </div>
        {props.isAuthenticated ? (
          <Link
            href="/formulaire"
            className="inline-flex rounded-full bg-card px-6 py-3 text-sm font-medium text-forest hover:bg-bg"
          >
            Continuer le formulaire
          </Link>
        ) : (
          <div className="w-full md:w-auto">
            <GoogleSignInButton label="Connexion professionnelle" />
          </div>
        )}
      </div>
    </section>
  );
}
