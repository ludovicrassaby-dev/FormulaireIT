"use client";

import { useFieldContext } from "@/components/form/form-context";
import { FieldError } from "@/components/form/field-error";
import { controlClassName, labelClassName } from "@/components/form/field-styles";

export function SelectField(props: {
  label: string;
  disabled?: boolean;
  placeholder: string;
  className?: string;
  options: Array<{ value: string; label: string }>;
  onValueChange?: (value: string) => void;
}) {
  const field = useFieldContext<string>();
  return (
    <label className={`block ${props.className ?? ""}`}>
      <span className={labelClassName}>{props.label}</span>
      <select
        value={field.state.value}
        disabled={props.disabled}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value);
          props.onValueChange?.(event.target.value);
        }}
        className={controlClassName}
      >
        <option value="">{props.placeholder}</option>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError messages={field.state.meta.errors} />
    </label>
  );
}
