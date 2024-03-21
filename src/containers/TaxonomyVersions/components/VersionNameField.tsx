/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FieldErrorMessage, InputV3, Label } from "@ndla/forms";
import { FormControl, FormField } from "../../../components/FormField";
const VersionNameField = () => {
  const { t } = useTranslation();
  return (
    <FormField name="name">
      {({ field, meta }) => (
        <FormControl isRequired isInvalid={!!meta.error}>
          <Label textStyle="label-small" margin="none">
            {t("taxonomyVersions.form.name.label")}
          </Label>
          <InputV3 {...field} placeholder={t("taxonomyVersions.form.name.placeholder")} />
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </FormControl>
      )}
    </FormField>
  );
};
export default VersionNameField;
