/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_YEAR } from '../../../../constants';
import TaxonomyMetadataDropdown from './TaxonomyMetadataDropdown';

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const SubjectYearSelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();
  const years = [1, 2, 3];
  const options = years.map(y => ({
    key: `${y}`,
    value: `${t('taxonomy.metadata.schoolYearPrefix')}${y}`,
  }));
  const messages = {
    selected: t('taxonomy.metadata.placeholders.year'),
    title: t('taxonomy.metadata.customFields.level'),
  };
  return (
    <TaxonomyMetadataDropdown
      field={TAXONOMY_CUSTOM_FIELD_SUBJECT_YEAR}
      options={options}
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      messages={messages}
    />
  );
};

export default SubjectYearSelector;
