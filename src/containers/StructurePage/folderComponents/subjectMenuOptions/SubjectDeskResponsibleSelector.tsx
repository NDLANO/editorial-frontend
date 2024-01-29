/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import SubjectCustomFieldSelector from "./SubjectCustomFieldSelector";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_DESK_RESPONSIBLE } from "../../../../constants";

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const SubjectDeskResponsibeSelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();

  const messages = {
    selected: t("taxonomy.metadata.placeholders.deskResponsible"),
    title: t("taxonomy.metadata.customFields.subjectDeskResponsible"),
  };

  return (
    <SubjectCustomFieldSelector
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      field={TAXONOMY_CUSTOM_FIELD_SUBJECT_DESK_RESPONSIBLE}
      messages={messages}
    />
  );
};

export default SubjectDeskResponsibeSelector;
