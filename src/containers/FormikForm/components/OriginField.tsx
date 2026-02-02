/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../components/FormField";

const OriginField = () => {
  const { t } = useTranslation();
  return (
    <FormField name="origin">
      {({ field, meta }) => (
        <FieldRoot invalid={!!meta.error}>
          <FieldLabel>{t("form.origin.label")}</FieldLabel>
          <FieldInput {...field}></FieldInput>
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </FieldRoot>
      )}
    </FormField>
  );
};

export default OriginField;
