/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldErrorMessage, FieldHelper, FieldRoot, SelectLabel } from "@ndla/primitives";
import { Version } from "@ndla/types-taxonomy";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../components/FormField";
import { OptGroupVersionSelector } from "../../../components/Taxonomy/OptGroupVersionSelector";

interface Props {
  existingVersions: Version[];
}

const VersionSourceField = ({ existingVersions }: Props) => {
  const { t } = useTranslation();

  return (
    <FormField name="sourceId">
      {({ field, meta, helpers }) => (
        <FieldRoot invalid={!!meta.error}>
          <OptGroupVersionSelector
            versions={existingVersions}
            currentVersion={field.value}
            onVersionChanged={(val) => helpers.setValue(val.id)}
          >
            <SelectLabel>{t("taxonomyVersions.form.source.title")}</SelectLabel>
            <FieldHelper>{t("taxonomyVersions.form.source.subTitle")}</FieldHelper>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </OptGroupVersionSelector>
        </FieldRoot>
      )}
    </FormField>
  );
};
export default VersionSourceField;
