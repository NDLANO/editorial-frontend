/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldHelper,
  FieldRoot,
} from "@ndla/primitives";
import { FormField } from "../../../components/FormField";

const ProcessedField = () => {
  const { t } = useTranslation();
  const [originField] = useField<string>("origin");
  return (
    <FormField name="processed">
      {({ field, helpers }) => (
        <FieldRoot disabled={!originField.value?.length && !field.value}>
          {!originField.value?.length && <FieldHelper>{t("form.processed.disabledCause")}</FieldHelper>}
          <CheckboxRoot checked={field.value} onCheckedChange={(details) => helpers.setValue(details.checked)}>
            <CheckboxControl>
              <CheckboxIndicator asChild>
                <CheckLine />
              </CheckboxIndicator>
            </CheckboxControl>
            <CheckboxLabel>{t("form.processed.description")}</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        </FieldRoot>
      )}
    </FormField>
  );
};

export default ProcessedField;
