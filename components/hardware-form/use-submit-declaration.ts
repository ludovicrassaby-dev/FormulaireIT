"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { submitDeclaration } from "@/lib/declaration-api";
import {
  collectAttachments,
  toSubmitPayload,
  type DeclarationFormValues,
} from "@/components/hardware-form/declaration-values";

export function useSubmitDeclaration() {
  const router = useRouter();
  const [progressMessage, setProgressMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async (values: DeclarationFormValues) =>
      submitDeclaration({
        payload: toSubmitPayload(values),
        attachments: collectAttachments(values),
        onProgress: setProgressMessage,
      }),
    onSuccess: (result) => {
      const params = new URLSearchParams({
        region: result.regionName,
        agency: result.agencyName,
      });
      router.push(`/formulaire/confirmation?${params.toString()}`);
    },
    onError: () => setProgressMessage(""),
  });

  return { mutation, progressMessage };
}
