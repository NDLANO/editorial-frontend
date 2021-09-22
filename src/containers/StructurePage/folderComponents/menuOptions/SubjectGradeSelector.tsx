/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_GRADE } from '../../../../constants';
import TaxonomyMetadataDropdown from './TaxonomyMetadataDropdown';

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const SubjectGradeSelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();
  const grades = [1, 2, 3];
  const options = grades.map(grade => ({
    key: `${grade}`,
    value: `${t('taxonomy.metadata.gradePrefix')}${grade}`,
  }));
  const messages = {
    selected: t('taxonomy.metadata.placeholders.grade'),
    title: t('taxonomy.metadata.customFields.grade'),
  };
  return (
    <TaxonomyMetadataDropdown
      field={TAXONOMY_CUSTOM_FIELD_SUBJECT_GRADE}
      options={options}
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      messages={messages}
    />
  );
};

export default SubjectGradeSelector;
