export function getDriveRootFolderId(): string {
  return (
    process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim() ||
    "1-Ki7Bfo0wNnYngr2BXALVZFL6MOZlW05"
  );
}

export function getSheetId(): string {
  return (
    process.env.GOOGLE_SHEET_ID?.trim() ||
    "1aUMu1dbWKHAgc5cw4QJ40bMfOhh1Dqz7jadmjpiIys0"
  );
}
