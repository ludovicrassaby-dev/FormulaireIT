"use client";

import { Trash2 } from "lucide-react";
import { FieldGuide } from "@/components/form/field-guide";
import { withForm } from "@/components/form/use-app-form";
import { defaultDeclarationValues } from "@/components/hardware-form/declaration-values";
import { MAX_SERIAL_PHOTOS, COMPUTER_STATUSES, COMPUTER_TYPES } from "@/lib/declaration-schema";
import { STATUS_LABELS, TYPE_LABELS } from "@/lib/labels";

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
      <article className="rounded-[24px] border border-line bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Poste {String(index + 1).padStart(2, "0")}</h2>
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-accent hover:bg-accent/10"
            >
              <Trash2 className="h-4 w-4" />
              Retirer
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
          <form.AppField name={`${prefix}.status`}>
            {(field) => (
              <field.SelectField
                label="État"
                placeholder="Choisir un état"
                options={COMPUTER_STATUSES.map((status) => ({
                  value: status,
                  label: STATUS_LABELS[status],
                }))}
              />
            )}
          </form.AppField>
          <form.AppField name={`${prefix}.brandModel`}>
            {(field) => (
              <field.TextField label="Marque / modèle" placeholder="Fujitsu LIFEBOOK, ThinkPad…" />
            )}
          </form.AppField>
          <form.AppField name={`${prefix}.location`}>
            {(field) => (
              <field.TextField
                label="Localisation dans l’agence"
                placeholder="Armoire R+1, bureau 12…"
              />
            )}
          </form.AppField>
        </div>

        <section className="mt-6 space-y-4 border-t border-line pt-5">
          <h3 className="font-serif text-xl">Identification du poste</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <form.AppField name={`${prefix}.windowsDeviceName`}>
                {(field) => (
                  <field.TextField
                    label="Nom de l’appareil (Windows)"
                    hint="Clic droit sur Ce PC → Propriétés, puis recopiez le nom de l’appareil."
                    placeholder="Ex. ENV022102IFE78"
                  />
                )}
              </form.AppField>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <FieldGuide
                  src="/guides/ce-pc-proprietes.png"
                  alt="Clic droit sur Ce PC puis Propriétés"
                  caption="Clic droit sur Ce PC → Propriétés"
                />
                <FieldGuide
                  src="/guides/nom-appareil-windows.png"
                  alt="Nom de l’appareil dans les informations Windows"
                  caption="Recopiez le nom encadré, ex. ENV022102IFE78"
                />
              </div>
            </div>

            <div>
              <form.AppField name={`${prefix}.koesioInventoryNumber`}>
                {(field) => (
                  <field.TextField
                    label="N° d’inventaire Koesio (s’il existe)"
                    hint="Étiquette Koesio : « Numéro d’inventaire »."
                    placeholder="Ex. K0587"
                  />
                )}
              </form.AppField>
              <FieldGuide
                src="/guides/koesio-inventaire.jpg"
                alt="Étiquette Koesio avec numéro d’inventaire"
                caption="Uniquement si l’étiquette Koesio est présente"
              />
            </div>

            <div>
              <form.AppField name={`${prefix}.isSosReseau`}>
                {(field) => (
                  <field.CheckboxField
                    compact
                    title="PC SOS Réseau"
                    description="Cochez si le poste appartient au parc SOS Réseau."
                  />
                )}
              </form.AppField>
              <form.Subscribe selector={(state) => state.values.computers[index]?.isSosReseau}>
                {(isSosReseau) =>
                  isSosReseau ? (
                    <div className="mt-3">
                      <form.AppField name={`${prefix}.sosReseauReference`}>
                        {(field) => (
                          <field.TextField
                            label="Référence SOS Réseau"
                            hint="Étiquette collée sur le poste (souvent au format ENV…)."
                            placeholder="Ex. ENV022212IFP210"
                          />
                        )}
                      </form.AppField>
                      <FieldGuide
                        src="/guides/sos-reseau-reference.jpg"
                        alt="Étiquette de référence SOS Réseau sur un ordinateur"
                        caption="Référence SOS Réseau sur l’étiquette du poste"
                      />
                    </div>
                  ) : null
                }
              </form.Subscribe>
            </div>

            <div className="sm:col-span-2">
              <form.AppField name={`${prefix}.serial`}>
                {(field) => (
                  <field.TextField
                    label="N° de série constructeur"
                    hint="Sous le PC, étiquette constructeur, mention S/N. Si illisible, joignez une photo ci-dessous."
                    placeholder="Ex. EQAB032548"
                  />
                )}
              </form.AppField>
              <FieldGuide
                src="/guides/numero-serie.jpg"
                alt="Étiquette constructeur avec le numéro de série S/N"
                caption="Saisissez le S/N, sinon envoyez une photo de cette étiquette"
              />
              <form.AppField name={`${prefix}.serialPhotos`}>
                {(field) => (
                  <field.AttachmentsField
                    className="mt-3"
                    label="Photo du n° de série (si vous ne pouvez pas le saisir)"
                    hint="JPG, PNG, WEBP ou HEIC · 4 Mo max · 2 photos max"
                    maxFiles={MAX_SERIAL_PHOTOS}
                  />
                )}
              </form.AppField>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <form.AppField name={`${prefix}.lastUsed`}>
            {(field) => (
              <field.TextField label="Dernière utilisation connue" placeholder="Ex. mars 2025, inconnu…" />
            )}
          </form.AppField>
          <form.AppField name={`${prefix}.comment`}>
            {(field) => (
              <field.TextAreaField label="Commentaire" rows={2} className="sm:col-span-2" />
            )}
          </form.AppField>
          <form.AppField name={`${prefix}.files`}>
            {(field) => (
              <field.AttachmentsField
                label="Autres photos (poste, emplacement…)"
                hint="JPG, PNG, WEBP, HEIC ou PDF · 4 Mo max · 6 fichiers max"
              />
            )}
          </form.AppField>
        </div>
      </article>
    );
  },
});
