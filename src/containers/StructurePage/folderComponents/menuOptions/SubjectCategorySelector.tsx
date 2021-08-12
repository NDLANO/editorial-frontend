/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { constants } from '@ndla/ui';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from '../../../../constants';
import TaxonomyMetadataDropdown from './TaxonomyMetadataDropdown';

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const SubjectCategorySelector = ({ customFields, updateCustomFields, t }: Props & tType) => {
  const { subjectCategories } = constants;
  const options = [
    {
      key: subjectCategories.COMMON_SUBJECTS,
      value: t(`subjectCategories.${subjectCategories.COMMON_SUBJECTS}`),
    },
    {
      key: subjectCategories.PROGRAMME_SUBJECTS,
      value: t(`subjectCategories.${subjectCategories.PROGRAMME_SUBJECTS}`),
    },
    {
      key: subjectCategories.SPECIALIZED_SUBJECTS,
      value: t(`subjectCategories.${subjectCategories.SPECIALIZED_SUBJECTS}`),
    },
    {
      key: subjectCategories.ARCHIVE_SUBJECTS,
      value: t(`subjectCategories.${subjectCategories.ARCHIVE_SUBJECTS}`),
    },
    {
      key: subjectCategories.BETA_SUBJECTS,
      value: t(`subjectCategories.${subjectCategories.BETA_SUBJECTS}`),
    },
  ];
  const messages = {
    selected: t('taxonomy.metadata.placeholders.category'),
    title: t('taxonomy.metadata.customFields.subjectCategory'),
  };
  return (
    <TaxonomyMetadataDropdown
      field={TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY}
      options={options}
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      messages={messages}
    />
  );
};

export default injectT(SubjectCategorySelector);
