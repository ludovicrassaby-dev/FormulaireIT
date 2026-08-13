import { STATUS_LABELS, TYPE_LABELS } from "@/lib/labels";
import type { ComputerPayload, SubmitPayload } from "@/lib/declaration-schema";

type RecapContext = {
  companyName: string;
  managerName: string;
  managerEmail: string;
  regionName: string;
  agencyName: string;
  payload: SubmitPayload;
};

function line(label: string, value: string): string {
  return `${label} : ${value.trim() || "—"}`;
}

function formatSubmittedAt(): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date());
}

function formatComputer(computer: ComputerPayload, index: number): string {
  return [
    `--- Poste ${String(index).padStart(2, "0")} ---`,
    line("Type", TYPE_LABELS[computer.type]),
    line("Marque / modèle", computer.brandModel),
    line("Nom de l'appareil (Windows)", computer.windowsDeviceName),
    line("N° d'inventaire Koesio", computer.koesioInventoryNumber),
    line("PC SOS Réseau", computer.isSosReseau ? "Oui" : "Non"),
    line("Référence SOS Réseau", computer.sosReseauReference),
    line("N° de série constructeur", computer.serial),
    line("Photo du n° de série jointe", computer.hasSerialPhoto ? "Oui" : "Non"),
    line("Localisation", computer.location),
    line("État", STATUS_LABELS[computer.status]),
    line("Dernière utilisation connue", computer.lastUsed),
    line("Commentaire", computer.comment),
    "",
  ].join("\n");
}

export function buildRecapText(context: RecapContext): string {
  const header = [
    `Identification du matériel inutilisé — ${context.companyName}`,
    "================================================",
    "",
    line("Date", formatSubmittedAt()),
    line("Manager", `${context.managerName} (${context.managerEmail})`),
    line("Région", context.regionName),
    line("Agence", context.agencyName),
    line("Contact sur site", context.payload.siteContact),
    line("Commentaire général", context.payload.generalComment),
    "",
  ];

  if (context.payload.hasNoUnusedComputer) {
    return [...header, "Aucun ordinateur inutilisé déclaré dans cette agence.", ""].join("\n");
  }

  return [
    ...header,
    `Nombre de postes déclarés : ${context.payload.computers.length}`,
    "",
    ...context.payload.computers.map((computer, index) => formatComputer(computer, index + 1)),
  ].join("\n");
}

export function buildRecapJson(context: RecapContext): string {
  return JSON.stringify(
    {
      campaign: "identification-materiel-inutilise",
      company: context.companyName,
      submittedAt: new Date().toISOString(),
      manager: {
        name: context.managerName,
        email: context.managerEmail,
      },
      location: {
        region: context.regionName,
        agency: context.agencyName,
        regionId: context.payload.regionId,
        agencyId: context.payload.agencyId,
      },
      siteContact: context.payload.siteContact,
      generalComment: context.payload.generalComment,
      hasNoUnusedComputer: context.payload.hasNoUnusedComputer,
      computers: context.payload.computers,
    },
    null,
    2,
  );
}
