/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { Version } from "@ndla/types-taxonomy";
import FieldHeader from "../../../components/Field/FieldHeader";
import FormikField from "../../../components/FormikField";
import OptGroupVersionSelector from "../../../components/Taxonomy/OptGroupVersionSelector";

interface Props {
  existingVersions: Version[];
}

const VersionSourceField = ({ existingVersions }: Props) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext();

  const findCurrentlySelected = (hash: string) => existingVersions.find((v) => v.hash === hash);

  return (
    <>
      <FieldHeader
        title={t("taxonomyVersions.form.source.title")}
        subTitle={t("taxonomyVersions.form.source.subTitle")}
      />
      <FormikField name="sourceId">
        {({ field }: FieldProps) => (
          <OptGroupVersionSelector
            versions={existingVersions}
            currentVersion={field.value}
            onVersionChanged={(val) => setFieldValue("sourceId", findCurrentlySelected(val)?.id)}
          />
        )}
      </FormikField>
    </>
  );
};
export default VersionSourceField;
