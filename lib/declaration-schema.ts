import { z } from "zod";

export const COMPUTER_TYPES = ["portable", "fixe", "all-in-one", "autre"] as const;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
] as const;

export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_COMPUTER = 6;
export const MAX_SERIAL_PHOTOS = 2;
export const UNSET_SCORE = -1;

export const computerPayloadSchema = z.object({
  type: z.enum(COMPUTER_TYPES),
  koesioInventoryNumber: z.string(),
  isSosReseau: z.boolean(),
  sosReseauReference: z.string(),
  windowsDeviceName: z.string(),
  serial: z.string(),
  hasSerialPhoto: z.boolean(),
  appearanceScore: z
    .number()
    .int()
    .min(1, "Notez l'aspect du matériel (de 1 à 5).")
    .max(5, "Notez l'aspect du matériel (de 1 à 5)."),
  functioningScore: z
    .number()
    .int()
    .min(0, "Notez le fonctionnement (de 0 à 5).")
    .max(5, "Notez le fonctionnement (de 0 à 5)."),
  comment: z.string(),
});

export const submitPayloadSchema = z
  .object({
    regionId: z.string().min(1, "Choisissez une région."),
    agencyId: z.string().min(1, "Choisissez une agence."),
    hasNoUnusedComputer: z.boolean(),
    siteContact: z.string(),
    generalComment: z.string(),
    computers: z.array(computerPayloadSchema),
  })
  .superRefine((value, context) => {
    if (value.hasNoUnusedComputer) return;
    if (value.computers.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["computers"],
        message: "Ajoutez au moins un ordinateur, ou indiquez qu'aucun poste n'est inutilisé.",
      });
    }
  });

export type ComputerPayload = z.infer<typeof computerPayloadSchema>;
export type SubmitPayload = z.infer<typeof submitPayloadSchema>;
export type ComputerType = (typeof COMPUTER_TYPES)[number];

export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number]);
}
