"use client";

import { Plus, UserRound } from "lucide-react";
import type { PublicRegion } from "@/lib/agencies";
import { submitPayloadSchema } from "@/lib/declaration-schema";
import { ComputerCard } from "@/components/hardware-form/computer-card";
import {
  createEmptyComputer,
  defaultDeclarationValues,
  toSubmitPayload,
} from "@/components/hardware-form/declaration-values";
import { useSubmitDeclaration } from "@/components/hardware-form/use-submit-declaration";
import { useAppForm } from "@/components/form/use-app-form";

export function HardwareForm(props: {
  regions: PublicRegion[];
  userName: string;
  userEmail: string;
}) {
  const { mutation, progressMessage } = useSubmitDeclaration();

  const form = useAppForm({
    defaultValues: defaultDeclarationValues,
    validators: {
      onSubmit: ({ value }) => {
        const parsed = submitPayloadSchema.safeParse(toSubmitPayload(value));
        if (parsed.success) return undefined;
        return parsed.error.issues[0]?.message || "Formulaire incomplet.";
      },
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <section className="rounded-[24px] border border-line bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-deep text-forest">
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">{props.userName}</p>
            <p className="text-sm text-muted">{props.userEmail}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-[24px] border border-line bg-card p-5 sm:grid-cols-2">
        <form.AppField name="regionId">
          {(field) => (
            <field.SelectField
              label="Région"
              placeholder="Choisir une région"
              options={props.regions.map((region) => ({
                value: region.id,
                label: region.name,
              }))}
              onValueChange={() => form.setFieldValue("agencyId", "")}
            />
          )}
        </form.AppField>
        <form.Subscribe selector={(state) => state.values.regionId}>
          {(regionId) => {
            const agencies =
              props.regions.find((region) => region.id === regionId)?.agencies ?? [];
            return (
              <form.AppField name="agencyId">
                {(field) => (
                  <field.SelectField
                    label="Agence"
                    disabled={!regionId}
                    placeholder={
                      regionId ? "Choisir une agence" : "Sélectionnez d’abord la région"
                    }
                    options={agencies.map((agency) => ({
                      value: agency.id,
                      label: agency.name,
                    }))}
                  />
                )}
              </form.AppField>
            );
          }}
        </form.Subscribe>
        <form.AppField name="siteContact">
          {(field) => (
            <field.TextField
              label="Contact sur site (optionnel)"
              placeholder="Nom, téléphone ou e-mail d’une personne sur place"
              className="sm:col-span-2"
            />
          )}
        </form.AppField>
      </section>

      <form.AppField name="hasNoUnusedComputer">
        {(field) => (
          <field.CheckboxField
            title="Aucun ordinateur inutilisé dans cette agence"
            description="Cochez si le parc de ce site est entièrement utilisé. Une synthèse sera tout de même déposée dans Drive."
          />
        )}
      </form.AppField>

      <form.Subscribe selector={(state) => state.values.hasNoUnusedComputer}>
        {(hasNoUnusedComputer) =>
          hasNoUnusedComputer ? null : (
            <form.Field name="computers" mode="array">
              {(field) => (
                <section className="space-y-4">
                  {field.state.value.map((_, index) => (
                    <ComputerCard
                      key={index}
                      form={form}
                      index={index}
                      canRemove={field.state.value.length > 1}
                      onRemove={() => field.removeValue(index)}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => field.pushValue(createEmptyComputer())}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm hover:bg-bg-deep"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un autre poste
                  </button>
                </section>
              )}
            </form.Field>
          )
        }
      </form.Subscribe>

      <form.AppField name="generalComment">
        {(field) => (
          <field.TextAreaField
            label="Commentaire général (optionnel)"
            placeholder="Accès au local, volume estimé, précisions pour l’équipe IT…"
          />
        )}
      </form.AppField>

      <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
        {(submitError) =>
          submitError ? (
            <p className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-dark">
              {String(submitError)}
            </p>
          ) : null
        }
      </form.Subscribe>

      {mutation.isError ? (
        <p className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-dark">
          {mutation.error.message}
        </p>
      ) : null}
      {progressMessage ? <p className="text-sm text-forest">{progressMessage}</p> : null}

      <form.AppForm>
        <form.SubmitButton
          idleLabel="Envoyer vers le dossier Drive de l’agence"
          pendingLabel="Envoi en cours…"
        />
      </form.AppForm>
    </form>
  );
}
