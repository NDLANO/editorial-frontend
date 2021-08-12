/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { injectT, tType } from '@ndla/i18n';
import React from 'react';
import { LOCALE_VALUES, TAXONOMY_CUSTOM_FIELD_LANGUAGE } from '../../../../constants';
import TaxonomyMetadataDropdown from './TaxonomyMetadataDropdown';

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const TaxonomyMetadataLanguageSelector = ({
  customFields,
  updateCustomFields,
  t,
}: Props & tType) => {
  const options = [
    {
      key: LOCALE_VALUES[0],
      value: LOCALE_VALUES[0],
    },
    {
      key: LOCALE_VALUES[1],
      value: LOCALE_VALUES[1],
    },
    {
      key: LOCALE_VALUES[2],
      value: LOCALE_VALUES[2],
    },
  ];
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

export default injectT(TaxonomyMetadataLanguageSelector);
