/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheckboxCheckedChangeDetails } from "@ark-ui/react";
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
import { useField } from "formik";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const ProcessedField = () => {
  const { t } = useTranslation();
  const [originField] = useField<string>("origin");
  const [processedField, _, processedHelpers] = useField<boolean>("processed");

  const onCheckedChange = useCallback(
    (details: CheckboxCheckedChangeDetails) => {
      processedHelpers.setValue(details.checked === true);
    },
    [processedHelpers],
  );

  return (
    <FieldRoot disabled={!originField.value?.length && !processedField.value}>
      {!originField.value?.length && <FieldHelper>{t("form.processed.disabledCause")}</FieldHelper>}
      <CheckboxRoot checked={processedField.value} onCheckedChange={onCheckedChange}>
        <CheckboxControl>
          <CheckboxIndicator asChild>
            <CheckLine />
          </CheckboxIndicator>
        </CheckboxControl>
        <CheckboxLabel>{t("form.processed.description")}</CheckboxLabel>
        <CheckboxHiddenInput />
      </CheckboxRoot>
    </FieldRoot>
  );
};

export default ProcessedField;
