import { google } from "googleapis";
import type { ComputerPayload, SubmitPayload } from "@/lib/declaration-schema";
import { getGoogleAuth } from "@/lib/google-auth";
import { getSheetId } from "@/lib/google-targets";
import { TYPE_LABELS } from "@/lib/labels";

const SHEET_TITLE = "Reponses";

const HEADER_ROW = [
  "Date",
  "Manager",
  "Email collaborateur",
  "Région",
  "Agence",
  "Type",
  "Nom appareil Windows",
  "N° inventaire Koesio",
  "PC SOS Réseau",
  "Référence SOS Réseau",
  "N° de série",
  "Photo S/N jointe",
  "Aspect (1-5)",
  "Fonctionnement (0-5)",
  "Commentaire poste",
  "Contact site",
  "Commentaire général",
  "Dossier Drive",
];

type SheetContext = {
  managerName: string;
  managerEmail: string;
  regionName: string;
  agencyName: string;
  folderUrl: string;
  payload: SubmitPayload;
};

async function getSheets() {
  return google.sheets({ version: "v4", auth: await getGoogleAuth() });
}

function spreadsheetId(): string {
  return getSheetId();
}

async function ensureResponsesTab(
  sheets: Awaited<ReturnType<typeof getSheets>>,
  id: string,
) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: id });
  const exists = meta.data.sheets?.some((sheet) => sheet.properties?.title === SHEET_TITLE);
  if (exists) return;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: id,
    requestBody: {
      requests: [{ addSheet: { properties: { title: SHEET_TITLE } } }],
    },
  });
}

async function ensureHeader(
  sheets: Awaited<ReturnType<typeof getSheets>>,
  id: string,
) {
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `${SHEET_TITLE}!A1:R1`,
  });
  if (existing.data.values?.[0]?.length) return;
  await sheets.spreadsheets.values.update({
    spreadsheetId: id,
    range: `${SHEET_TITLE}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADER_ROW] },
  });
}

function computerRow(context: SheetContext, computer: ComputerPayload, submittedAt: string): string[] {
  return [
    submittedAt,
    context.managerName,
    context.managerEmail,
    context.regionName,
    context.agencyName,
    TYPE_LABELS[computer.type],
    computer.windowsDeviceName,
    computer.koesioInventoryNumber,
    computer.isSosReseau ? "Oui" : "Non",
    computer.sosReseauReference,
    computer.serial,
    computer.hasSerialPhoto ? "Oui" : "Non",
    String(computer.appearanceScore),
    String(computer.functioningScore),
    computer.comment,
    context.payload.siteContact,
    context.payload.generalComment,
    context.folderUrl,
  ];
}

function emptyAgencyRow(context: SheetContext, submittedAt: string): string[] {
  return [
    submittedAt,
    context.managerName,
    context.managerEmail,
    context.regionName,
    context.agencyName,
    "—",
    "Aucun poste inutilisé",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    context.payload.siteContact,
    context.payload.generalComment,
    context.folderUrl,
  ];
}

export async function appendDeclarationToSheet(context: SheetContext): Promise<void> {
  const id = spreadsheetId();
  const sheets = await getSheets();
  await ensureResponsesTab(sheets, id);
  await ensureHeader(sheets, id);

  const submittedAt = new Date().toISOString();
  const values = context.payload.hasNoUnusedComputer
    ? [emptyAgencyRow(context, submittedAt)]
    : context.payload.computers.map((computer) => computerRow(context, computer, submittedAt));

  await sheets.spreadsheets.values.append({
    spreadsheetId: id,
    range: `${SHEET_TITLE}!A:R`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
}
