/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import { injectT } from '@ndla/i18n';

import { FormPill } from '@ndla/forms';
import { fetchCompetences } from '../../modules/draft/draftApi';
import { AsyncDropdown } from '../../components/Dropdown';
import { isCompetenceValid } from '../../util/articleUtil';
import { TranslateType } from "../../interfaces";
import {FieldProps, FormikActions, FormikValues} from "formik";

interface Props {
  t: TranslateType;
  articleCompetences: string[];
  field: FieldProps<string[]>['field'];
  form: {
    setFieldTouched: FormikActions<FormikValues>['setFieldTouched'];
  };
}

interface CompetenceWithTitle {
  title: string;
}

const FormikCompetencesContent = ({
  t,
  articleCompetences = [],
  field,
  form,
}: Props) => {
  const convertToCompetencesWithTitle = (competencesWithoutTitle:string[]) => {
    return competencesWithoutTitle.map(c => ({ title: c }));
  };

  const [competences, setCompetences] = useState(articleCompetences);

  const searchForCompetences = async (inp:string) => {
    const result = await fetchCompetences(inp);
    result.results = convertToCompetencesWithTitle(result.results);
    return result;
  };

  const updateFormik = (formikField: Props['field'], newData: string[]) => {
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const addCompetence = (competence: CompetenceWithTitle) => {
    if (competence) {
      if (
        !competences.includes(competence.title) &&
        isCompetenceValid(competence.title)
      ) {
        const temp = [...competences, competence.title];
        setCompetences(temp);
        updateFormik(field, temp);
        form.setFieldTouched('competences', true, true);
      }
    }
  };

  const createNewCompetence = (newCompetence: string) => {
    if (
      !competences.includes(newCompetence.trim()) &&
      isCompetenceValid(newCompetence)
    ) {
      const temp = [...competences, newCompetence.trim()];
      setCompetences(temp);
      updateFormik(field, temp);
      form.setFieldTouched('competences', true, true);
    }
  };

  const removeCompetence = (index:string) => {
    const reduced_array = competences.filter(
      (_, idx) => idx !== parseInt(index),
    );
    setCompetences(reduced_array);
    updateFormik(field, reduced_array);
    form.setFieldTouched('competences', true, true);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <Fragment>
      {competences.map((competence, index) => (
        <FormPill
          id={index.toString()}
          label={competence+"LELELE"}
          onClick={removeCompetence}
          key={index}
        />
      ))}

      <AsyncDropdown
        idField="title"
        name="CompetencesSearch"
        labelField="title"
        placeholder={t('form.competences.placeholder')}
        label="label"
        apiAction={searchForCompetences}
        onClick={(e:Event) => e.stopPropagation()}
        onChange={addCompetence}
        selectedItems={convertToCompetencesWithTitle(competences)}
        multiSelect
        disableSelected
        onCreate={createNewCompetence}
        onKeyDown={onKeyDown}
      />
    </Fragment>
  );
};

export default injectT(FormikCompetencesContent);
