"use client";

import { useFieldContext } from "@/components/form/form-context";
import { FieldError } from "@/components/form/field-error";

export function ScoreField(props: {
  label: string;
  minLabel: string;
  maxLabel: string;
  min: number;
  max: number;
}) {
  const field = useFieldContext<number>();
  const scores = Array.from({ length: props.max - props.min + 1 }, (_, index) => props.min + index);

  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-3 text-sm font-medium">{props.label}</legend>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="text-xs font-medium text-accent sm:w-28">{props.minLabel}</span>
        <div className="flex flex-wrap gap-2">
          {scores.map((score) => {
            const isSelected = field.state.value === score;
            return (
              <label
                key={score}
                className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border text-base font-medium ${
                  isSelected
                    ? "border-forest bg-forest text-card"
                    : "border-line bg-bg hover:border-forest"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={field.name}
                  checked={isSelected}
                  onBlur={field.handleBlur}
                  onChange={() => field.handleChange(score)}
                />
                {score}
              </label>
            );
          })}
        </div>
        <span className="text-xs font-medium text-forest sm:w-32">{props.maxLabel}</span>
      </div>
      <FieldError messages={field.state.meta.errors} />
    </fieldset>
  );
}
