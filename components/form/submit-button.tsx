"use client";

import { useFormContext } from "@/components/form/form-context";

export function SubmitButton(props: { idleLabel: string; pendingLabel: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? props.pendingLabel : props.idleLabel}
        </button>
      )}
    </form.Subscribe>
  );
}
