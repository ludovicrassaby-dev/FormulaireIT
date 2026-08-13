import catalog from "@/data/agencies.json";

export type Agency = {
  id: string;
  name: string;
  driveFolderId: string;
};

export type Region = {
  id: string;
  name: string;
  agencies: Agency[];
};

export type PublicAgency = Omit<Agency, "driveFolderId">;
export type PublicRegion = {
  id: string;
  name: string;
  agencies: PublicAgency[];
};

export function getCatalog(): Region[] {
  return catalog.regions as Region[];
}

export function getPublicCatalog(): PublicRegion[] {
  return getCatalog().map((region) => ({
    id: region.id,
    name: region.name,
    agencies: region.agencies.map(({ id, name }) => ({ id, name })),
  }));
}

export function findRegion(regionId: string): Region | undefined {
  return getCatalog().find((region) => region.id === regionId);
}

export function findAgency(
  regionId: string,
  agencyId: string,
): { region: Region; agency: Agency } | undefined {
  const region = findRegion(regionId);
  const agency = region?.agencies.find((item) => item.id === agencyId);
  if (!region || !agency) return undefined;
  return { region, agency };
}

export function isPlaceholderFolderId(folderId: string): boolean {
  return !folderId || folderId.startsWith("REMPLACER_PAR_");
}
