/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { TAXONOMY_CUSTOM_FIELD_LANGUAGE } from '../../../../constants';
import { supportedLanguages } from '../../../../i18n2';
import TaxonomyMetadataDropdown from './TaxonomyMetadataDropdown';

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const TaxonomyMetadataLanguageSelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();
  const options = supportedLanguages.map(lang => ({ key: lang, value: lang }));
  const messages = {
    selected: t('taxonomy.metadata.placeholders.language'),
    title: t('taxonomy.metadata.customFields.languagePlaceholder'),
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
