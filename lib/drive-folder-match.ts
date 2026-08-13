export type NamedFolder = {
  id: string;
  name: string;
};

export function normalizeFolderName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/gi, "oe")
    .replace(/æ/gi, "ae")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

export function findFolderByLabel(
  folders: NamedFolder[],
  label: string,
): NamedFolder | undefined {
  const wanted = normalizeFolderName(label);
  const matches = folders.filter((folder) => normalizeFolderName(folder.name) === wanted);
  if (matches.length === 0) return undefined;
  if (matches.length === 1) return matches[0];

  const withHyphen = matches.filter((folder) => folder.name.includes("-"));
  if (withHyphen.length === 1) return withHyphen[0];
  return matches[0];
}
