/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import isEqual from 'lodash/fp/isEqual';
import { useFormik } from 'formik';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { injectT, tType } from '@ndla/i18n';
import { Select } from '@ndla/forms';
import Button, { MultiButton } from '@ndla/button';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { fetchSearchTags } from '../../../../../modules/concept/conceptApi';
import AsyncSearchTags from '../../../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { MultiSelectDropdown } from '../../../../../components/Dropdown/MultiSelectDropdown';
import { License } from '../../../../../interfaces';
import { InputField, InputPair } from './SearchStyles';
import { SubjectType } from '../../../../../modules/taxonomy/taxonomyApiInterfaces';
import { ConceptStatusType } from '../../../../../modules/concept/conceptApiInterfaces';

export interface InlineFormConcept {
  title: string;
  author: string;
  license: string;
  subjects: SubjectType[];
  tags: string[];
  newStatus?: ConceptStatusType;
}
interface ErrorsType {
  title?: string;
  subjects?: string;
}

interface Props {
  initialValues: InlineFormConcept;
  status: string;
  language: string;
  onSubmit: (c: InlineFormConcept) => void;
  licenses: License[];
  allSubjects: SubjectType[];
  cancel: () => void;
}

const StyledHelpMessage = styled.span`
  display: block;
  color: ${colors.support.red};
  margin-bottom: 5px;
`;

const validate = (values: InlineFormConcept): ErrorsType => {
  const errors: ErrorsType = {};
  if (!values.title) {
    errors.title = 'required';
  }
  if (values.subjects.length === 0) {
    errors.subjects = 'required';
  }
  return errors;
};

const ConceptForm = ({
  initialValues,
  status,
  language,
  onSubmit,
  licenses,
  allSubjects,
  cancel,
  t,
}: Props & tType) => {
  const formik = useFormik<InlineFormConcept>({
    initialValues,
    validate,
    onSubmit,
  });
  const { values, errors, handleChange, handleBlur, setValues } = formik;
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]); // eslint-disable-line react-hooks/exhaustive-deps
  const hasChanges = !isEqual(initialValues, values);

  const licensesWithTranslations = licenses
    .filter(license => license.license !== 'N/A')
    .map(license => ({
      ...license,
      ...getLicenseByAbbreviation(license.license, language),
    }));

  return (
    <form>
      <InputPair>
        <InputField>
          <label htmlFor="title">{t('form.name.title')}</label>
          <input
            id="title"
            name="title"
            type="text"
            aria-label={t('form.name.title')}
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.title ? (
            <StyledHelpMessage>
              {t('validation.isRequired', { label: t('form.name.title') })}
            </StyledHelpMessage>
          ) : null}
        </InputField>
        <InputField>
          <label htmlFor="author">{t('writer')}</label>
          <input
            id="author"
            name="author"
            type="text"
            aria-label={t('writer')}
            value={values.author}
            onChange={handleChange}
          />
        </InputField>
      </InputPair>

      <InputField>
        <label htmlFor="license">{t('form.name.license')}</label>
        <Select
          value={values.license}
          onChange={(v: any) => {
            const value = v.target.value;
            setValues({
              ...values,
              license: value,
            });
          }}>
          {!values.license && <option>{t('form.license.choose')}</option>}
          {licensesWithTranslations.map(license => (
            <option value={license.license} key={license.license}>
              {license.title}
            </option>
          ))}
        </Select>
      </InputField>
      <InputField>
        <label htmlFor="subjects">{t('searchForm.tagType.subjects')}</label>
        <MultiSelectDropdown
          id="subjects"
          name="subjects"
          labelField="name"
          value={values.subjects}
          onChange={handleChange}
          minSearchLength={1}
          initialData={allSubjects}
          onBlur={handleBlur}
        />
        {errors.subjects ? (
          <StyledHelpMessage>
            {t('validation.isRequired', { label: t('searchForm.tagType.subjects') })}
          </StyledHelpMessage>
        ) : null}
      </InputField>
      <InputField>
        <label htmlFor="tags">{t('form.categories.label')}</label>
        <AsyncSearchTags
          language={language}
          initialTags={values.tags}
          updateValue={(updatedValue: string[]) => {
            setValues({ ...values, tags: updatedValue });
          }}
          fetchTags={fetchSearchTags}
        />
      </InputField>
      <div className="buttons">
        <Button className="form-button secondary" onClick={cancel}>
          {t('editorFooter.cancelLabel')}
        </Button>
        <MultiButton
          disabled={!hasChanges || Object.keys(errors).length > 0}
          className="form-button"
          onClick={(value: string) => {
            const getStatus = (v: string, s: string) => {
              if (v === 'saveAndPublish') {
                return 'PUBLISHED';
              } else if (s === 'PUBLISHED') {
                return 'QUALITY_ASSURED';
              } else {
                return undefined;
              }
            };
            const newStatus = getStatus(value, status);
            onSubmit({ ...values, newStatus });
          }}
          mainButton={{ value: 'save' }}
          secondaryButtons={[
            {
              label: t('form.saveAndPublish'),
              value: 'saveAndPublish',
            },
          ]}>
          <span>{t(`form.save`)}</span>
        </MultiButton>
      </div>
    </form>
  );
};

export default injectT(ConceptForm);
