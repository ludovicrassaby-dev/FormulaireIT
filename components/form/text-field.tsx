"use client";

import { useFieldContext } from "@/components/form/form-context";
import { FieldError } from "@/components/form/field-error";
import { controlClassName, labelClassName } from "@/components/form/field-styles";

export function TextField(props: {
  label: string;
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  const field = useFieldContext<string>();
  return (
    <label className={`block ${props.className ?? ""}`}>
      <span className={labelClassName}>{props.label}</span>
      {props.hint ? <span className="mb-2 block text-xs text-muted">{props.hint}</span> : null}
      <input
        value={field.state.value}
        placeholder={props.placeholder}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        className={controlClassName}
      />
      <FieldError messages={field.state.meta.errors} />
    </label>
  );
}
