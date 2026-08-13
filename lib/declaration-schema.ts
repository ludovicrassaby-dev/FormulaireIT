import { z } from "zod";

export const COMPUTER_TYPES = ["portable", "fixe", "all-in-one", "autre"] as const;
export const COMPUTER_STATUSES = [
  "fonctionnel-inutilise",
  "hors-service",
  "inconnu",
] as const;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
] as const;

export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_COMPUTER = 6;
export const MAX_SERIAL_PHOTOS = 2;

export const computerPayloadSchema = z.object({
  type: z.enum(COMPUTER_TYPES),
  brandModel: z.string(),
  koesioInventoryNumber: z.string(),
  isSosReseau: z.boolean(),
  sosReseauReference: z.string(),
  windowsDeviceName: z.string(),
  serial: z.string(),
  hasSerialPhoto: z.boolean(),
  location: z.string(),
  status: z.enum(COMPUTER_STATUSES),
  lastUsed: z.string(),
  comment: z.string(),
});

function addComputerIdentityIssue(
  context: z.RefinementCtx,
  index: number,
  field: keyof z.infer<typeof computerPayloadSchema>,
  message: string,
) {
  context.addIssue({
    code: "custom",
    path: ["computers", index, field],
    message,
  });
}

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
      return;
    }
    value.computers.forEach((computer, index) => {
      if (!computer.windowsDeviceName.trim()) {
        addComputerIdentityIssue(
          context,
          index,
          "windowsDeviceName",
          "Indiquez le nom de l'appareil (Ce PC → Propriétés).",
        );
      }
      if (computer.isSosReseau && !computer.sosReseauReference.trim()) {
        addComputerIdentityIssue(
          context,
          index,
          "sosReseauReference",
          "Indiquez la référence SOS Réseau de l'étiquette.",
        );
      }
      if (!computer.serial.trim() && !computer.hasSerialPhoto) {
        addComputerIdentityIssue(
          context,
          index,
          "serial",
          "Saisissez le n° de série, ou joignez une photo de l'étiquette S/N.",
        );
      }
    });
  });

export type ComputerPayload = z.infer<typeof computerPayloadSchema>;
export type SubmitPayload = z.infer<typeof submitPayloadSchema>;
export type ComputerType = (typeof COMPUTER_TYPES)[number];
export type ComputerStatus = (typeof COMPUTER_STATUSES)[number];

export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number]);
}
