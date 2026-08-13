export function FieldGuide(props: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="mt-2 overflow-hidden rounded-xl border border-line bg-bg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.src} alt={props.alt} className="max-h-56 w-full object-contain bg-white" />
      <figcaption className="px-3 py-2 text-xs leading-relaxed text-muted">{props.caption}</figcaption>
    </figure>
  );
}
