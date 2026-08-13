function asMessage(item: unknown): string | null {
  if (typeof item === "string" && item.trim()) return item;
  if (item && typeof item === "object") {
    const record = item as { message?: unknown; form?: unknown };
    if (typeof record.form === "string" && record.form.trim()) return record.form;
    if (typeof record.message === "string" && record.message.trim()) return record.message;
  }
  return null;
}

export function firstFormError(errors: unknown[]): string | null {
  for (const error of errors) {
    const message = asMessage(error);
    if (message) return message;
  }
  return errors.length > 0
    ? "Formulaire incomplet. Vérifiez les champs marqués en rouge."
    : null;
}

export function FieldError(props: { messages: unknown[] }) {
  const message = props.messages.map(asMessage).find(Boolean);
  if (!message) return null;
  return <p className="mt-1 text-sm text-danger">{message}</p>;
}
