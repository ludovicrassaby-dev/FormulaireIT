import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function PageShell(props: {
  children: React.ReactNode;
  headerVariant?: "default" | "solid";
}) {
  return (
    <>
      <SiteHeader variant={props.headerVariant} />
      {props.children}
      <SiteFooter />
    </>
  );
}
