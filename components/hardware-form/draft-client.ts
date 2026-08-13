"use client";

import {
  createEmptyComputer,
  defaultDeclarationValues,
  type ComputerDraft,
  type DeclarationFormValues,
} from "@/components/hardware-form/declaration-values";
import { COMPUTER_TYPES, type ComputerType } from "@/lib/declaration-schema";

type StoredFile = {
  name: string;
  type: string;
  lastModified: number;
  content: string;
};

type StoredDraft = {
  regionId: string;
  agencyId: string;
  hasNoUnusedComputer: boolean;
  siteContact: string;
  generalComment: string;
  computers: Array<
    Omit<ComputerDraft, "serialPhotos" | "files"> & {
      serialPhotos: StoredFile[];
      files: StoredFile[];
    }
  >;
};

function isComputerType(value: unknown): value is ComputerType {
  return COMPUTER_TYPES.includes(value as ComputerType);
}

function isStoredFile(value: unknown): value is StoredFile {
  if (!value || typeof value !== "object") return false;
  const file = value as StoredFile;
  return (
    typeof file.name === "string" &&
    typeof file.type === "string" &&
    typeof file.content === "string"
  );
}

async function fileToStored(file: File): Promise<StoredFile> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return {
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    content: btoa(binary),
  };
}

function storedToFile(file: StoredFile): File {
  const binary = atob(file.content);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new File([bytes], file.name, {
    type: file.type || "application/octet-stream",
    lastModified: file.lastModified || Date.now(),
  });
}

async function serializeDraft(values: DeclarationFormValues): Promise<StoredDraft> {
  return {
    regionId: values.regionId,
    agencyId: values.agencyId,
    hasNoUnusedComputer: values.hasNoUnusedComputer,
    siteContact: values.siteContact,
    generalComment: values.generalComment,
    computers: await Promise.all(
      values.computers.map(async (computer) => ({
        ...computer,
        serialPhotos: await Promise.all(computer.serialPhotos.map(fileToStored)),
        files: await Promise.all(computer.files.map(fileToStored)),
      })),
    ),
  };
}

function parseStoredDraft(payload: unknown): DeclarationFormValues | null {
  if (!payload || typeof payload !== "object") return null;
  const draft = payload as Partial<StoredDraft>;
  const computers = Array.isArray(draft.computers) ? draft.computers : [];
  return {
    regionId: typeof draft.regionId === "string" ? draft.regionId : "",
    agencyId: typeof draft.agencyId === "string" ? draft.agencyId : "",
    hasNoUnusedComputer: Boolean(draft.hasNoUnusedComputer),
    siteContact: typeof draft.siteContact === "string" ? draft.siteContact : "",
    generalComment: typeof draft.generalComment === "string" ? draft.generalComment : "",
    computers:
      computers.length > 0
        ? computers.map((computer) => ({
            ...createEmptyComputer(),
            ...computer,
            type: isComputerType(computer.type) ? computer.type : createEmptyComputer().type,
            serialPhotos: Array.isArray(computer.serialPhotos)
              ? computer.serialPhotos.filter(isStoredFile).map(storedToFile)
              : [],
            files: Array.isArray(computer.files)
              ? computer.files.filter(isStoredFile).map(storedToFile)
              : [],
          }))
        : defaultDeclarationValues.computers,
  };
}

export async function fetchDraft(): Promise<DeclarationFormValues | null> {
  const response = await fetch("/api/draft");
  if (!response.ok) return null;
  const body = (await response.json()) as { draft?: unknown };
  return parseStoredDraft(body.draft);
}

export async function saveDraft(values: DeclarationFormValues): Promise<boolean> {
  const trySave = (payload: StoredDraft) =>
    fetch("/api/draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  const full = await serializeDraft(values);
  let response = await trySave(full);
  if (response.status === 413) {
    response = await trySave({
      ...full,
      computers: full.computers.map((computer) => ({
        ...computer,
        serialPhotos: [],
        files: [],
      })),
    });
  }
  return response.ok;
}

export async function clearDraft(): Promise<void> {
  await fetch("/api/draft", { method: "DELETE" });
}
