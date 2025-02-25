/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import TaxonomyMetadataDropdown from "./TaxonomyMetadataDropdown";
import { TAXONOMY_CUSTOM_FIELD_LANGUAGE } from "../../../../constants";
import { collectionLanguages } from "../../../../i18n2";

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const TaxonomyMetadataLanguageSelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();
  const options = collectionLanguages.map((lang) => ({
    key: lang,
    value: t(`languages.${lang}`),
  }));
  const messages = {
    selected: t("taxonomy.metadata.placeholders.language"),
    title: t("taxonomy.metadata.customFields.languagePlaceholder"),
  };

  return (
    <TaxonomyMetadataDropdown
      field={TAXONOMY_CUSTOM_FIELD_LANGUAGE}
      options={options}
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      messages={messages}
    />
  );
};

export default TaxonomyMetadataLanguageSelector;
