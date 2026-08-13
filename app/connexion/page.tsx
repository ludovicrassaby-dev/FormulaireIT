import { redirect } from "next/navigation";

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.error) query.set("error", params.error);
  if (params.callbackUrl) query.set("callbackUrl", params.callbackUrl);
  const suffix = query.toString();
  redirect(suffix ? `/?${suffix}` : "/");
}
