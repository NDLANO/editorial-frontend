/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FieldErrorMessage, Label, Select } from "@ndla/forms";
import { FormControl, FormField } from "../../../components/FormField";
import { useLicenses } from "../../../modules/draft/draftQueries";
import { getLicensesWithTranslations } from "../../../util/licenseHelpers";

interface Props {
  name?: string;
  enableLicenseNA?: boolean;
}

const LicenseField = ({ name = "license", enableLicenseNA }: Props) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const licensesWithTranslations = getLicensesWithTranslations(licenses!, locale, enableLicenseNA);

  return (
    <FormField name={name}>
      {({ field, meta }) => (
        <FormControl isInvalid={!!meta.error}>
          <Label textStyle="label-small" margin="small">
            {t("form.license.label")}
          </Label>
          <Select {...field}>
            {!field.value && <option>{t("form.license.choose")}</option>}
            {licensesWithTranslations.map((license) => (
              <option value={license.license} key={license.license}>
                {license.title}
              </option>
            ))}
          </Select>
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </FormControl>
      )}
    </FormField>
  );
};

export default LicenseField;
