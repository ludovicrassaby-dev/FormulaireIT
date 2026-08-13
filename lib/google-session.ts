export function sessionHasGoogleDriveAccess(session: {
  accessToken?: string;
  googleScope?: string;
  error?: string;
} | null): boolean {
  if (!session?.accessToken || session.error) return false;
  const scope = session.googleScope || "";
  if (!scope) return true;
  return (
    scope.includes("googleapis.com/auth/drive") &&
    scope.includes("googleapis.com/auth/spreadsheets")
  );
}
