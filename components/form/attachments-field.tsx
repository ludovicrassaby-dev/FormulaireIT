"use client";

import { Upload } from "lucide-react";
import { FieldError } from "@/components/form/field-error";
import { useFieldContext } from "@/components/form/form-context";
import {
  MAX_ATTACHMENTS_PER_COMPUTER,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/declaration-schema";

function rejectOversizedFile(files: File[]): string | undefined {
  const oversized = files.find((file) => file.size > MAX_FILE_SIZE_BYTES);
  if (!oversized) return undefined;
  return `« ${oversized.name} » dépasse 4 Mo. Compressez la photo ou envoyez-en une autre.`;
}

export function AttachmentsField(props: {
  label: string;
  hint: string;
  maxFiles?: number;
  className?: string;
}) {
  const field = useFieldContext<File[]>();
  const files = field.state.value;
  const maxFiles = props.maxFiles ?? MAX_ATTACHMENTS_PER_COMPUTER;

  return (
    <label className={`block ${props.className ?? "sm:col-span-2"}`}>
      <span className="mb-2 block text-sm font-medium">{props.label}</span>
      <div className="rounded-xl border border-dashed border-line bg-bg px-3 py-4">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
          multiple
          className="text-sm"
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            const oversizedMessage = rejectOversizedFile(selected);
            if (oversizedMessage) {
              field.setErrorMap({ onChange: oversizedMessage });
              return;
            }
            field.handleChange([...files, ...selected].slice(0, maxFiles));
            event.target.value = "";
          }}
        />
        <p className="mt-2 flex items-center gap-1 text-xs text-muted">
          <Upload className="h-3.5 w-3.5 shrink-0" />
          {props.hint}
        </p>
        {files.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex justify-between gap-3">
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  className="text-accent"
                  onClick={() => field.handleChange(files.filter((_, fileIndex) => fileIndex !== index))}
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <FieldError messages={field.state.meta.errors} />
    </label>
  );
}
