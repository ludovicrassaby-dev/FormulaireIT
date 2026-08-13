import { auth } from "@/auth";
import { HttpError } from "@/lib/http";

export async function requireSessionEmail(): Promise<{
  email: string;
  name: string;
}> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new HttpError("Connexion obligatoire.", 401);
  return {
    email,
    name: session.user?.name || "Non renseigné",
  };
}
