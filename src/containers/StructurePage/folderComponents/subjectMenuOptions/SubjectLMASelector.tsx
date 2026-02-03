/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA } from "../../../../constants";
import SubjectCustomFieldSelector from "./SubjectCustomFieldSelector";

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const SubjectLMASelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();

  const messages = {
    selected: t("taxonomy.metadata.placeholders.lma"),
    title: t("taxonomy.metadata.customFields.subjectLMA"),
  };
  return (
    <SubjectCustomFieldSelector
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      field={TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA}
      messages={messages}
    />
  );
};

export default SubjectLMASelector;
