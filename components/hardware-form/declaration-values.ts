import {
  COMPUTER_STATUSES,
  COMPUTER_TYPES,
  type ComputerPayload,
} from "@/lib/declaration-schema";

export type ComputerDraft = Omit<ComputerPayload, "hasSerialPhoto"> & {
  serialPhotos: File[];
  files: File[];
};

export type DeclarationFormValues = {
  regionId: string;
  agencyId: string;
  hasNoUnusedComputer: boolean;
  siteContact: string;
  generalComment: string;
  computers: ComputerDraft[];
};

export function createEmptyComputer(): ComputerDraft {
  return {
    type: COMPUTER_TYPES[0],
    brandModel: "",
    koesioInventoryNumber: "",
    isSosReseau: false,
    sosReseauReference: "",
    windowsDeviceName: "",
    serial: "",
    location: "",
    status: COMPUTER_STATUSES[0],
    lastUsed: "",
    comment: "",
    serialPhotos: [],
    files: [],
  };
}

export const defaultDeclarationValues: DeclarationFormValues = {
  regionId: "",
  agencyId: "",
  hasNoUnusedComputer: false,
  siteContact: "",
  generalComment: "",
  computers: [createEmptyComputer()],
};

export function toSubmitPayload(values: DeclarationFormValues) {
  return {
    regionId: values.regionId,
    agencyId: values.agencyId,
    hasNoUnusedComputer: values.hasNoUnusedComputer,
    siteContact: values.siteContact,
    generalComment: values.generalComment,
    computers: values.hasNoUnusedComputer
      ? []
      : values.computers.map((computer) => ({
          type: computer.type,
          brandModel: computer.brandModel,
          koesioInventoryNumber: computer.koesioInventoryNumber,
          isSosReseau: computer.isSosReseau,
          sosReseauReference: computer.isSosReseau ? computer.sosReseauReference : "",
          windowsDeviceName: computer.windowsDeviceName,
          serial: computer.serial,
          hasSerialPhoto: computer.serialPhotos.length > 0,
          location: computer.location,
          status: computer.status,
          lastUsed: computer.lastUsed,
          comment: computer.comment,
        })),
  };
}

function attachmentLabel(prefix: string, fileIndex: number): string {
  return `${prefix}-${fileIndex + 1}`;
}

export function collectAttachments(values: DeclarationFormValues) {
  if (values.hasNoUnusedComputer) return [];
  return values.computers.flatMap((computer, computerIndex) => {
    const poste = `poste-${String(computerIndex + 1).padStart(2, "0")}`;
    const serials = computer.serialPhotos.map((file, fileIndex) => ({
      file,
      label: attachmentLabel(`${poste}_numero-serie`, fileIndex),
    }));
    const others = computer.files.map((file, fileIndex) => ({
      file,
      label: attachmentLabel(`${poste}_pj`, fileIndex),
    }));
    return [...serials, ...others];
  });
}
