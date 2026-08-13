import { Readable } from "stream";
import { google, type drive_v3 } from "googleapis";
import { isPlaceholderFolderId, type Agency, type Region } from "@/lib/agencies";

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

function getCredentials(): ServiceAccount {
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (rawJson) {
    const parsed = JSON.parse(rawJson) as ServiceAccount;
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON incomplet.");
    }
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    };
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) {
    throw new Error(
      "Compte de service Google manquant (GOOGLE_SERVICE_ACCOUNT_JSON ou GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY).",
    );
  }

  return { client_email: clientEmail, private_key: privateKey };
}

export function getDrive(): drive_v3.Drive {
  const credentials = getCredentials();
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return google.drive({ version: "v3", auth });
}

const driveOptions = {
  supportsAllDrives: true,
} as const;

function sanitizeName(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim();
}

async function findChildFolder(
  drive: drive_v3.Drive,
  parentId: string,
  name: string,
): Promise<string | undefined> {
  const escaped = name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const response = await drive.files.list({
    ...driveOptions,
    includeItemsFromAllDrives: true,
    q: `'${parentId}' in parents and name = '${escaped}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    pageSize: 1,
  });
  return response.data.files?.[0]?.id ?? undefined;
}

async function createFolder(
  drive: drive_v3.Drive,
  parentId: string,
  name: string,
): Promise<{ id: string; webViewLink?: string | null }> {
  const response = await drive.files.create({
    ...driveOptions,
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id, webViewLink",
  });
  if (!response.data.id) {
    throw new Error("Impossible de créer le dossier Drive.");
  }
  return { id: response.data.id, webViewLink: response.data.webViewLink };
}

async function findOrCreateFolder(
  drive: drive_v3.Drive,
  parentId: string,
  name: string,
): Promise<string> {
  const existing = await findChildFolder(drive, parentId, name);
  if (existing) return existing;
  const created = await createFolder(drive, parentId, name);
  return created.id;
}

export async function resolveAgencyFolderId(
  region: Region,
  agency: Agency,
): Promise<string> {
  if (!isPlaceholderFolderId(agency.driveFolderId)) {
    return agency.driveFolderId;
  }

  const rootId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!rootId) {
    throw new Error(
      `Aucun dossier Drive n'est configuré pour l'agence « ${agency.name} ». Renseignez driveFolderId dans data/agencies.json ou GOOGLE_DRIVE_ROOT_FOLDER_ID.`,
    );
  }

  const drive = getDrive();
  const regionFolderId = await findOrCreateFolder(drive, rootId, sanitizeName(region.name));
  return findOrCreateFolder(drive, regionFolderId, sanitizeName(agency.name));
}

export async function createSubmissionFolder(
  parentId: string,
  name: string,
): Promise<{ id: string; webViewLink: string }> {
  const drive = getDrive();
  const created = await createFolder(drive, parentId, sanitizeName(name));
  return {
    id: created.id,
    webViewLink: created.webViewLink || `https://drive.google.com/drive/folders/${created.id}`,
  };
}

export async function uploadBuffer(options: {
  folderId: string;
  filename: string;
  mimeType: string;
  buffer: Buffer;
}): Promise<string> {
  const drive = getDrive();
  const response = await drive.files.create({
    ...driveOptions,
    requestBody: {
      name: sanitizeName(options.filename),
      parents: [options.folderId],
    },
    media: {
      mimeType: options.mimeType,
      body: Readable.from(options.buffer),
    },
    fields: "id",
  });
  if (!response.data.id) {
    throw new Error("Échec de l'envoi du fichier vers Drive.");
  }
  return response.data.id;
}
