export function FieldError(props: { messages: unknown[] }) {
  const message = props.messages
    .map((item) => (typeof item === "string" ? item : null))
    .find(Boolean);
  if (!message) return null;
  return <p className="mt-1 text-sm text-accent">{message}</p>;
}
