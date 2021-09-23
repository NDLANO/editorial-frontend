/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { FormPill } from '@ndla/forms';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_GRADE } from '../../../../constants';
import TaxonomyMetadataDropdown from './TaxonomyMetadataDropdown';

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const PillContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-right: ${spacing.small};
`;

const fromGradeString = (gradeString?: string) =>
  gradeString
    ?.split(',')
    .map(s => parseInt(s))
    .filter(s => !isNaN(s)) ?? [];

const toGradeString = (grades?: number[]) => grades?.map(grade => grade.toString()).join(',');

const SubjectGradeSelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();
  const initialValues = fromGradeString(customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_GRADE]);
  const grades = [1, 2, 3];
  const availableGrades = grades.filter(s => !initialValues.includes(s));
  const options = availableGrades.map(grade => ({
    key: `${grade}`,
    value: `${t('taxonomy.metadata.gradePrefix')}${grade}`,
  }));
  const defaultOption = {
    key: '',
    value: t('taxonomy.metadata.placeholders.grade'),
  };
  const messages = {
    selected: t('taxonomy.metadata.placeholders.grade'),
    title: t('taxonomy.metadata.customFields.grade'),
  };

  const onDelete = (grade: number) => {
    const removed = toGradeString(initialValues.filter(x => x !== grade));
    updateCustomFields({ ...customFields, [TAXONOMY_CUSTOM_FIELD_SUBJECT_GRADE]: removed! });
  };

  const onUpdate = (updatedFields: Record<string, string>) => {
    const field = updatedFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_GRADE];
    if (!field) {
      updateCustomFields(updatedFields);
      return;
    }
    const grade = fromGradeString(field)[0];
    const allGrades = [...initialValues, grade];
    allGrades.sort((el1, el2) => el1 - el2);
    updateCustomFields({
      ...updatedFields,
      [TAXONOMY_CUSTOM_FIELD_SUBJECT_GRADE]: toGradeString(allGrades)!,
    });
  };

  const pills = (
    <PillContainer>
      {initialValues.map(grade => (
        <FormPill
          label={`${t('taxonomy.metadata.gradePrefix')}${grade}`}
          onClick={() => onDelete(grade)}
        />
      ))}
    </PillContainer>
  );

  return (
    <TaxonomyMetadataDropdown
      field={TAXONOMY_CUSTOM_FIELD_SUBJECT_GRADE}
      options={[defaultOption, ...options]}
      customFields={customFields}
      updateCustomFields={onUpdate}
      messages={messages}
      pills={pills}
    />
  );
};

export default SubjectGradeSelector;
