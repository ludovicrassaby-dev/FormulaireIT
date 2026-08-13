import { uploadBuffer } from "@/lib/drive";
import {
  isAllowedMimeType,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from "@/lib/declaration-schema";
import { extensionFor } from "@/lib/file-extension";
import { HttpError, jsonError } from "@/lib/http";
import { requireSessionEmail } from "@/lib/session";
import { verifySubmissionToken } from "@/lib/submission-token";

export const runtime = "nodejs";
export const maxDuration = 60;

function readUpload(formData: FormData): { token: string; label: string; file: File } {
  const token = String(formData.get("uploadToken") || "");
  const label = String(formData.get("label") || "piece-jointe");
  const file = formData.get("file");
  if (!(file instanceof File)) throw new HttpError("Fichier manquant.", 400);
  if (!isAllowedMimeType(file.type)) {
    throw new HttpError("Format non accepté. Photos (JPG, PNG, WEBP, HEIC) ou PDF uniquement.", 400);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new HttpError(`Fichier trop volumineux (${MAX_FILE_SIZE_MB} Mo maximum par pièce).`, 400);
  }
  return { token, label, file };
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionEmail();
    const { token, label, file } = readUpload(await request.formData());
    const { folderId } = verifySubmissionToken(token, user.email);
    const fileId = await uploadBuffer({
      folderId,
      filename: `${label}.${extensionFor(file.type, file.name)}`,
      mimeType: file.type,
      buffer: Buffer.from(await file.arrayBuffer()),
    });
    return Response.json({ fileId });
  } catch (error) {
    return jsonError(error, "Échec de l'envoi du fichier.");
  }
}
