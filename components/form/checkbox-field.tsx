"use client";

import { useFieldContext } from "@/components/form/form-context";

export function CheckboxField(props: {
  title: string;
  description: string;
  compact?: boolean;
}) {
  const field = useFieldContext<boolean>();
  const boxClassName = props.compact
    ? "flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-bg px-4 py-3 sm:col-span-2"
    : "flex cursor-pointer items-start gap-3 rounded-[24px] border border-line bg-card p-5";

  return (
    <label className={boxClassName}>
      <input
        type="checkbox"
        checked={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-forest"
      />
      <span>
        <span className="block font-medium">{props.title}</span>
        <span className="text-sm text-muted">{props.description}</span>
      </span>
    </label>
  );
}
