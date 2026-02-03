/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../components/FormField";

const VersionNameField = () => {
  const { t } = useTranslation();
  return (
    <FormField name="name">
      {({ field, meta }) => (
        <FieldRoot required invalid={!!meta.error}>
          <FieldLabel>{t("taxonomyVersions.form.name.label")}</FieldLabel>
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          <FieldInput {...field} placeholder={t("taxonomyVersions.form.name.placeholder")} />
        </FieldRoot>
      )}
    </FormField>
  );
};
export default VersionNameField;
