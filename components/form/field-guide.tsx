export function FieldGuide(props: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="mt-3 overflow-hidden rounded-2xl border border-line bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.src} alt={props.alt} className="max-h-[32rem] w-full object-contain" />
      <figcaption className="border-t border-line bg-bg px-4 py-3 text-sm leading-relaxed text-muted">
        {props.caption}
      </figcaption>
    </figure>
  );
}

export function IdentityZone(props: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border-2 border-line bg-bg p-5">
      <h3 className="font-serif text-2xl tracking-tight">{props.title}</h3>
      <p className="mt-1 mb-4 text-sm text-muted">{props.subtitle}</p>
      {props.children}
    </section>
  );
}
