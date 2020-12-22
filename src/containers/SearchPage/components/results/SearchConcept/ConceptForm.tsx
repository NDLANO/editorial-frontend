/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useContext } from 'react';
import isEqual from 'lodash/fp/isEqual';
import { injectT, tType } from '@ndla/i18n';
import { useFormik } from 'formik';
import { Select } from '@ndla/forms';
import Button, { MultiButton } from '@ndla/button';
import { DRAFT_PUBLISH_SCOPE } from '../../../../../constants';
import { UserAccessContext } from '../../../../App/App';
import { fetchSearchTags } from '../../../../../modules/draft/draftApi';
import AsyncSearchTags from '../../../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { MultiSelectDropdown } from '../../../../../components/Dropdown/MultiSelectDropdown';
import { SubjectType } from '../../../../../interfaces';
import { InputField, InputPair } from './SearchStyles';

export interface License {
  description: string;
  license: string;
  url?: string;
}

export interface ConceptFormType {
  title: string;
  author: string;
  license?: string;
  subjects: SubjectType[];
  tags: string[];
  newStatus?: string;
}

interface Props {
  initialValues: ConceptFormType;
  status: string;
  language: string;
  onSubmit: (c: ConceptFormType) => void;
  licenses: License[];
  allSubjects: SubjectType[];
  cancel: () => void;
}

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
  const formik = useFormik<ConceptFormType>({
    initialValues,
    onSubmit,
  });
  const { values, handleChange, setValues } = formik;
  useEffect(() => {
    setValues({ ...values, title: initialValues.title });
  }, [initialValues.title]);
  const userAccess = useContext<string>(UserAccessContext);
  const canPublish = userAccess.includes(DRAFT_PUBLISH_SCOPE);
  const hidePublishButton =
    !canPublish || (status !== 'PUBLISHED' && status !== 'QUALITY_ASSURED');
  const hasChanges = !isEqual(initialValues, values);

  return (
    <form>
      <InputPair>
        <InputField>
          <label htmlFor="title">Tittel</label>
          <input
            id="title"
            name="title"
            type="text"
            aria-label="Tittel"
            value={values.title}
            onChange={handleChange}
          />
        </InputField>
        <InputField>
          <label htmlFor="author">Forfatter</label>
          <input
            id="author"
            name="author"
            type="text"
            aria-label="Forfatter"
            value={values.author}
            onChange={handleChange}
          />
        </InputField>
      </InputPair>

      <InputField>
        <label htmlFor="license">Lisens</label>
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
          {licenses.map(license => (
            <option value={license.license} key={license.license}>
              {license.description}
            </option>
          ))}
        </Select>
      </InputField>
      <InputField>
        <label htmlFor="subjects">Fag</label>
        <MultiSelectDropdown
          id="subjects"
          name="subjects"
          value={values.subjects}
          onChange={handleChange}
          minSearchLength={1}
          data={allSubjects}
        />
      </InputField>
      <InputField>
        <label htmlFor="tags">Liste og filter</label>
        <AsyncSearchTags
          language={language}
          value={values.tags}
          updateValue={updatedValue => {
            setValues({ ...values, tags: updatedValue });
          }}
          fetchTags={fetchSearchTags}
        />
      </InputField>
      <div className="buttons">
        <Button className="form-button secondary" onClick={cancel}>
          Avbryt
        </Button>
        <MultiButton
          disabled={!hasChanges}
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
          secondaryButtons={
            hidePublishButton
              ? []
              : [
                  {
                    label: t('form.saveAndPublish'),
                    value: 'saveAndPublish',
                  },
                ]
          }>
          <span>{t(`form.save`)}</span>
        </MultiButton>
      </div>
    </form>
  );
};

export default injectT(ConceptForm);
