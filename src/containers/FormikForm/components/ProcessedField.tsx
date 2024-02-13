/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useTranslation } from "react-i18next";
import { CheckboxItem, FieldHeader, Label } from "@ndla/forms";
import { CheckboxWrapper } from "../../../components/Form/styles";
import { FormControl, FormField } from "../../../components/FormField";

const ProcessedField = () => {
  const { t } = useTranslation();
  const [originField] = useField<string>("origin");
  return (
    <>
      <FieldHeader title={t("form.processed.label")} width={3 / 4} />
      <FormField name="processed">
        {({ field }) => (
          <FormControl isDisabled={!originField.value?.length && !field.value}>
            <CheckboxWrapper>
              <CheckboxItem
                checked={field.value}
                onCheckedChange={() =>
                  field.onChange({
                    target: {
                      name: field.name,
                      value: !field.value,
                    },
                  })
                }
              />
              <Label margin="none" textStyle="label-small">
                {t("form.processed.description")}
              </Label>
            </CheckboxWrapper>
          </FormControl>
        )}
      </FormField>
      {!originField.value?.length && <span>{t("form.processed.disabledCause")}</span>}
    </>
  );
};

export default ProcessedField;
