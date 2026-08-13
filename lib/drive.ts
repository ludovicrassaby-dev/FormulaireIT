import { Readable } from "stream";
import { google, type drive_v3 } from "googleapis";
import { isPlaceholderFolderId, type Agency, type Region } from "@/lib/agencies";
import { findFolderByLabel, type NamedFolder } from "@/lib/drive-folder-match";
import { getGoogleAuth } from "@/lib/google-auth";
import { getDriveRootFolderId } from "@/lib/google-targets";

export async function getDrive(): Promise<drive_v3.Drive> {
  return google.drive({ version: "v3", auth: await getGoogleAuth() });
}

const driveOptions = {
  supportsAllDrives: true,
  includeItemsFromAllDrives: true,
} as const;

function sanitizeFileName(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim();
}

async function listChildFolders(
  drive: drive_v3.Drive,
  parentId: string,
): Promise<NamedFolder[]> {
  const folders: NamedFolder[] = [];
  let pageToken: string | undefined;

  do {
    const response = await drive.files.list({
      ...driveOptions,
      q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "nextPageToken, files(id, name)",
      pageSize: 100,
      pageToken,
    });
    for (const file of response.data.files ?? []) {
      if (file.id && file.name) folders.push({ id: file.id, name: file.name });
    }
    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return folders;
}

function requireFolder(folders: NamedFolder[], label: string, parentLabel: string): NamedFolder {
  const match = findFolderByLabel(folders, label);
  if (match) return match;
  const available = folders.map((folder) => folder.name).join(", ") || "(aucun dossier)";
  throw new Error(
    `Dossier Drive introuvable pour « ${label} » dans ${parentLabel}. Dossiers présents : ${available}.`,
  );
}

export async function resolveAgencyFolderId(
  region: Region,
  agency: Agency,
): Promise<string> {
  if (!isPlaceholderFolderId(agency.driveFolderId)) {
    return agency.driveFolderId;
  }

  const drive = await getDrive();
  const rootId = getDriveRootFolderId();
  const regionFolder = requireFolder(
    await listChildFolders(drive, rootId),
    region.name,
    "le dossier racine",
  );
  const agencyFolder = requireFolder(
    await listChildFolders(drive, regionFolder.id),
    agency.name,
    `« ${regionFolder.name} »`,
  );
  return agencyFolder.id;
}

async function createFolder(
  drive: drive_v3.Drive,
  parentId: string,
  name: string,
): Promise<{ id: string; webViewLink?: string | null }> {
  const response = await drive.files.create({
    ...driveOptions,
    requestBody: {
      name: sanitizeFileName(name),
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

export async function createSubmissionFolder(
  parentId: string,
  name: string,
): Promise<{ id: string; webViewLink: string }> {
  const drive = await getDrive();
  const created = await createFolder(drive, parentId, name);
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
  const drive = await getDrive();
  const response = await drive.files.create({
    ...driveOptions,
    requestBody: {
      name: sanitizeFileName(options.filename),
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
