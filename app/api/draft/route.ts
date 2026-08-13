import { deleteDraft, readDraft, writeDraft } from "@/lib/draft-store";
import { HttpError, jsonError } from "@/lib/http";
import { requireSessionEmail } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireSessionEmail();
    const raw = await readDraft(user.email);
    if (!raw) return Response.json({ draft: null });
    try {
      return Response.json({ draft: JSON.parse(raw) });
    } catch {
      throw new HttpError("Brouillon illisible.", 500);
    }
  } catch (error) {
    return jsonError(error, "Impossible de lire le brouillon.");
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireSessionEmail();
    const payload = await request.json();
    if (!payload || typeof payload !== "object") {
      throw new HttpError("Brouillon invalide.", 400);
    }
    await writeDraft(user.email, JSON.stringify(payload));
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("trop volumineux")) {
      return jsonError(new HttpError(error.message, 413), error.message);
    }
    return jsonError(error, "Impossible d'enregistrer le brouillon.");
  }
}

export async function DELETE() {
  try {
    const user = await requireSessionEmail();
    await deleteDraft(user.email);
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error, "Impossible de supprimer le brouillon.");
  }
}
