import { Lock } from "lucide-react";
import { signIn } from "@/auth";

export function GoogleSignInButton(props: {
  callbackUrl?: string;
  label?: string;
}) {
  const callbackUrl = props.callbackUrl ?? "/formulaire";
  const label = props.label ?? "Continuer avec le compte professionnel";

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: callbackUrl });
      }}
    >
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_-12px_rgba(179,58,22,0.7)] transition hover:bg-accent-dark"
      >
        <Lock className="h-4 w-4" />
        {label}
      </button>
    </form>
  );
}
