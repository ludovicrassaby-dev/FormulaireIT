const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/pdf": "pdf",
};

export function extensionFor(mimeType: string, originalName: string): string {
  const fromName = originalName.split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  return MIME_EXTENSIONS[mimeType] || "bin";
}
