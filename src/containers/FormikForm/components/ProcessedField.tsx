/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useTranslation } from "react-i18next";
import { CheckboxItem, FieldHelper, Label } from "@ndla/forms";
import { Text } from "@ndla/typography";
import { CheckboxWrapper } from "../../../components/Form/styles";
import { FormControl, FormField } from "../../../components/FormField";

const ProcessedField = () => {
  const { t } = useTranslation();
  const [originField] = useField<string>("origin");
  return (
    <>
      <Text textStyle="label-large" margin="small">
        {t("form.processed.label")}
      </Text>
      <FormField name="processed">
        {({ field }) => (
          <FormControl isDisabled={!originField.value?.length && !field.value}>
            {!originField.value?.length && (
              <FieldHelper>
                <span>{t("form.processed.disabledCause")}</span>
              </FieldHelper>
            )}
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
    </>
  );
};

export default ProcessedField;
