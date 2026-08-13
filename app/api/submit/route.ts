import { findAgency } from "@/lib/agencies";
import {
  createSubmissionFolder,
  resolveAgencyFolderId,
  uploadBuffer,
} from "@/lib/drive";
import { submitPayloadSchema } from "@/lib/declaration-schema";
import { getCompanyName } from "@/lib/env";
import { HttpError, jsonError } from "@/lib/http";
import { buildRecapJson, buildRecapText } from "@/lib/recap";
import { requireSessionEmail } from "@/lib/session";
import { appendDeclarationToSheet } from "@/lib/sheets";
import { toFolderSlug } from "@/lib/slug";
import { signSubmissionToken } from "@/lib/submission-token";

export const runtime = "nodejs";
export const maxDuration = 60;

function submissionFolderName(managerName: string, email: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const manager = toFolderSlug(managerName || email.split("@")[0] || "manager");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${date}_${manager}_${suffix}`;
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionEmail();
    const parsed = submitPayloadSchema.safeParse(await request.json());
    if (!parsed.success) {
      throw new HttpError(parsed.error.issues[0]?.message || "Requête invalide.", 400);
    }

    const payload = parsed.data.hasNoUnusedComputer
      ? { ...parsed.data, computers: [] }
      : parsed.data;

    const match = findAgency(payload.regionId, payload.agencyId);
    if (!match) throw new HttpError("Région ou agence inconnue.", 400);

    const parentFolderId = await resolveAgencyFolderId(match.region, match.agency);
    const folder = await createSubmissionFolder(
      parentFolderId,
      submissionFolderName(user.name, user.email),
    );

    const recapContext = {
      companyName: getCompanyName(),
      managerName: user.name,
      managerEmail: user.email,
      regionName: match.region.name,
      agencyName: match.agency.name,
      payload,
    };

    await uploadBuffer({
      folderId: folder.id,
      filename: "synthese.txt",
      mimeType: "text/plain; charset=utf-8",
      buffer: Buffer.from(buildRecapText(recapContext), "utf8"),
    });
    await uploadBuffer({
      folderId: folder.id,
      filename: "synthese.json",
      mimeType: "application/json; charset=utf-8",
      buffer: Buffer.from(buildRecapJson(recapContext), "utf8"),
    });

    await appendDeclarationToSheet({
      managerName: user.name,
      managerEmail: user.email,
      regionName: match.region.name,
      agencyName: match.agency.name,
      folderUrl: folder.webViewLink,
      payload,
    });

    return Response.json({
      folderId: folder.id,
      folderUrl: folder.webViewLink,
      uploadToken: signSubmissionToken(folder.id, user.email),
      regionName: match.region.name,
      agencyName: match.agency.name,
    });
  } catch (error) {
    return jsonError(error, "Erreur lors de l'enregistrement.");
  }
}
