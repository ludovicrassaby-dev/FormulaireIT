import { createFormHook } from "@tanstack/react-form";
import { AttachmentsField } from "@/components/form/attachments-field";
import { CheckboxField } from "@/components/form/checkbox-field";
import { fieldContext, formContext } from "@/components/form/form-context";
import { SelectField } from "@/components/form/select-field";
import { SubmitButton } from "@/components/form/submit-button";
import { TextAreaField } from "@/components/form/textarea-field";
import { TextField } from "@/components/form/text-field";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextAreaField,
    SelectField,
    CheckboxField,
    AttachmentsField,
  },
  formComponents: {
    SubmitButton,
  },
});
