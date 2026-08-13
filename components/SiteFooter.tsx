import { getCompanyName } from "@/lib/env";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-5 text-sm text-muted">
        {getCompanyName()} · Inventaire matériel
      </div>
    </footer>
  );
}
