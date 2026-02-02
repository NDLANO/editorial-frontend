/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_SA } from "../../../../constants";
import SubjectCustomFieldSelector from "./SubjectCustomFieldSelector";

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const SubjectSASelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();

  const messages = {
    selected: t("taxonomy.metadata.placeholders.sa"),
    title: t("taxonomy.metadata.customFields.subjectSA"),
  };
  return (
    <SubjectCustomFieldSelector
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      field={TAXONOMY_CUSTOM_FIELD_SUBJECT_SA}
      messages={messages}
    />
  );
};

export default SubjectSASelector;
