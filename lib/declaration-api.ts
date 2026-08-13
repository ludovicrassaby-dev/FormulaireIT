import { readErrorMessage } from "@/lib/http";
import type { SubmitPayload } from "@/lib/declaration-schema";

export type SubmitResult = {
  uploadToken: string;
  regionName: string;
  agencyName: string;
};

export type AttachmentUpload = {
  file: File;
  label: string;
};

export async function createDeclaration(payload: SubmitPayload): Promise<SubmitResult> {
  const response = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Impossible d'enregistrer la déclaration."));
  }
  return response.json() as Promise<SubmitResult>;
}

export async function uploadAttachment(
  uploadToken: string,
  attachment: AttachmentUpload,
): Promise<void> {
  const formData = new FormData();
  formData.set("uploadToken", uploadToken);
  formData.set("label", attachment.label);
  formData.set("file", attachment.file);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Échec de l'envoi d'une pièce jointe."));
  }
}

export async function submitDeclaration(options: {
  payload: SubmitPayload;
  attachments: AttachmentUpload[];
  onProgress: (message: string) => void;
}): Promise<SubmitResult> {
  options.onProgress("Création du dossier Drive de l'agence…");
  const result = await createDeclaration(options.payload);

  for (let index = 0; index < options.attachments.length; index += 1) {
    options.onProgress(
      `Envoi des pièces jointes ${index + 1}/${options.attachments.length}…`,
    );
    await uploadAttachment(result.uploadToken, options.attachments[index]);
  }

  return result;
}
