import Image from "next/image";

export function BrandLogo(props: { size?: number; className?: string }) {
  const size = props.size ?? 40;
  return (
    <Image
      src="/logo.webp"
      alt="Envergure"
      width={size}
      height={size}
      priority
      className={props.className ?? "h-10 w-10"}
    />
  );
}
