"use client";

import { Trash2 } from "lucide-react";
import { FieldGuide, IdentityZone } from "@/components/form/field-guide";
import { withForm } from "@/components/form/use-app-form";
import { defaultDeclarationValues } from "@/components/hardware-form/declaration-values";
import { COMPUTER_TYPES, MAX_FILE_SIZE_MB, MAX_SERIAL_PHOTOS } from "@/lib/declaration-schema";
import { TYPE_LABELS } from "@/lib/labels";

export const ComputerCard = withForm({
  defaultValues: defaultDeclarationValues,
  props: {
    index: 0,
    canRemove: false,
    onRemove: () => {
      return;
    },
  },
  render: function Render({ form, index, canRemove, onRemove }) {
    const prefix = `computers[${index}]` as const;
    return (
      <article className="space-y-4 rounded-[24px] border border-line bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Poste {String(index + 1).padStart(2, "0")}</h2>
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-4 w-4" />
              Retirer
            </button>
          ) : null}
        </div>

        <form.AppField name={`${prefix}.type`}>
          {(field) => (
            <field.SelectField
              label="Type"
              placeholder="Choisir un type"
              options={COMPUTER_TYPES.map((type) => ({
                value: type,
                label: TYPE_LABELS[type],
              }))}
            />
          )}
        </form.AppField>

        <IdentityZone
          title="1. Nom de l’appareil (Windows)"
          subtitle="Clic droit sur Ce PC → Propriétés, puis recopiez le nom encadré."
        >
          <form.AppField name={`${prefix}.windowsDeviceName`}>
            {(field) => (
              <field.TextField label="Nom de l’appareil" placeholder="Ex. ENV022102IFE78" />
            )}
          </form.AppField>
          <FieldGuide
            src="/guides/ce-pc-proprietes.png"
            alt="Clic droit sur Ce PC puis Propriétés"
            caption="Étape 1 — Clic droit sur Ce PC → Propriétés"
          />
          <FieldGuide
            src="/guides/nom-appareil-windows.png"
            alt="Nom de l’appareil dans les informations Windows"
            caption="Étape 2 — Recopiez le nom de l’appareil, ex. ENV022102IFE78"
          />
        </IdentityZone>

        <IdentityZone
          title="2. Numéro d’inventaire Koesio"
          subtitle="Sur l’étiquette Koesio, recopiez le numéro d’inventaire."
        >
          <form.AppField name={`${prefix}.koesioInventoryNumber`}>
            {(field) => (
              <field.TextField label="N° d’inventaire Koesio" placeholder="Ex. K0587" />
            )}
          </form.AppField>
          <FieldGuide
            src="/guides/koesio-inventaire.jpg"
            alt="Étiquette Koesio avec numéro d’inventaire"
            caption="Sur l’étiquette Koesio, recopiez la ligne « Numéro d’inventaire », ex. K0587"
          />
        </IdentityZone>

        <IdentityZone
          title="3. Référence SOS Réseau"
          subtitle="Étiquette collée sur le poste, souvent au format ENV…"
        >
          <form.AppField name={`${prefix}.sosReseauReference`}>
            {(field) => (
              <field.TextField
                label="Référence SOS Réseau"
                placeholder="Ex. ENV022212IFP210"
              />
            )}
          </form.AppField>
          <FieldGuide
            src="/guides/sos-reseau-reference.jpg"
            alt="Étiquette de référence SOS Réseau sur un ordinateur"
            caption="Étiquette collée sur le poste SOS Réseau, souvent au format ENV…"
          />
        </IdentityZone>

        <IdentityZone
          title="4. Numéro de série constructeur"
          subtitle="S/N sur l’étiquette constructeur, souvent sous le PC."
        >
          <form.AppField name={`${prefix}.serial`}>
            {(field) => (
              <field.TextField label="N° de série (S/N)" placeholder="Ex. EQAB032548" />
            )}
          </form.AppField>
          <FieldGuide
            src="/guides/numero-serie.jpg"
            alt="Étiquette constructeur avec le numéro de série S/N"
            caption="Mention S/N sur l’étiquette constructeur. Photo acceptée si le numéro est illisible."
          />
          <form.AppField name={`${prefix}.serialPhotos`}>
            {(field) => (
              <field.AttachmentsField
                className="mt-3"
                label="Photo du n° de série"
                hint={`JPG, PNG, WEBP ou HEIC · ${MAX_FILE_SIZE_MB} Mo max · 2 photos max`}
                maxFiles={MAX_SERIAL_PHOTOS}
              />
            )}
          </form.AppField>
        </IdentityZone>

        <IdentityZone title="5. État du matériel" subtitle="Notez l’aspect et le fonctionnement.">
          <div className="space-y-6">
          <form.AppField
            name={`${prefix}.appearanceScore`}
            validators={{
              onSubmit: ({ value }) =>
                value < 1 ? "Notez l'aspect du matériel (de 1 à 5)." : undefined,
            }}
          >
              {(field) => (
                <field.ScoreField
                  label="Aspect du matériel (obligatoire)"
                  minLabel="Très abîmé"
                  maxLabel="Excellent état"
                  min={1}
                  max={5}
                />
              )}
            </form.AppField>
          <form.AppField
            name={`${prefix}.functioningScore`}
            validators={{
              onSubmit: ({ value }) =>
                value < 0 ? "Notez le fonctionnement (de 0 à 5)." : undefined,
            }}
          >
              {(field) => (
                <field.ScoreField
                  label="Fonctionnement (obligatoire)"
                  minLabel="Hors service"
                  maxLabel="Optimal"
                  min={0}
                  max={5}
                />
              )}
            </form.AppField>
          </div>
        </IdentityZone>

        <form.AppField name={`${prefix}.comment`}>
          {(field) => <field.TextAreaField label="Commentaire (optionnel)" rows={2} />}
        </form.AppField>
        <form.AppField name={`${prefix}.files`}>
          {(field) => (
            <field.AttachmentsField
              label="Autres photos (optionnel)"
              hint={`JPG, PNG, WEBP, HEIC ou PDF · ${MAX_FILE_SIZE_MB} Mo max · 6 fichiers max`}
            />
          )}
        </form.AppField>
      </article>
    );
  },
});
