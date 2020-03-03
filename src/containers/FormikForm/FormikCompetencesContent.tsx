/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import { injectT } from '@ndla/i18n';
import { FormPill } from '@ndla/forms';
import { FieldProps, FormikActions, FormikValues } from 'formik';
import {
  fetchCompetences,
  fetchCompetenceDescription,
} from '../../modules/draft/draftApi';
import { AsyncDropdown } from '../../components/Dropdown';
import { isCompetenceValid } from '../../util/articleUtil';
import { TranslateType } from '../../interfaces';

interface Props {
  t: TranslateType;
  articleCompetences: string[];
  field: FieldProps<string[]>['field'];
  form: {
    setFieldTouched: FormikActions<FormikValues>['setFieldTouched'];
  };
}

interface Competence {
  code: string;
  description: string;
}

const FormikCompetencesContent = ({
  t,
  articleCompetences = [],
  field,
  form,
}: Props) => {
  const convertCompetencesToObject = async (competences: string[]) => {
    return Promise.all(
      competences.map(async c => {
        return {
          code: c,
          description: await fetchCompetenceDescription(c),
        };
      }),
    );
  };
  const [competences, setCompetences] = useState<Competence[]>([]);

  const searchForCompetences = async (inp: string) => {
    const result = await fetchCompetences(inp);
    result.results = await convertCompetencesToObject(result.results);
    return result;
  };

  useEffect(() => {
    (async () => {
      const comp = await convertCompetencesToObject(articleCompetences);
      setCompetences(comp);
    })();
  }, []);

  const updateFormik = (formikField: Props['field'], newData: string[]) => {
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const addCompetence = async (competence: Competence) => {
    const comp = await fetchCompetenceDescription(competence.code);
    if (
      comp &&
      !competences.filter(c => c.code === competence.code).length &&
      isCompetenceValid(competence.code)
    ) {
      const temp = [
        ...competences,
        {
          code: competence.code,
          description: await fetchCompetenceDescription(competence.code),
        },
      ];
      setCompetences(temp);
      updateFormik(field, temp.map(c => c.code));
      form.setFieldTouched('competences', true, true);
    }
  };

  const createNewCompetence = async (newCompetence: string) => {
    const comp = await fetchCompetenceDescription(newCompetence);
    if (
      comp &&
      !competences.filter(c => c.code === newCompetence).length &&
      isCompetenceValid(newCompetence)
    ) {
      const temp = [
        ...competences,
        {
          code: newCompetence,
          description: comp,
        },
      ];
      setCompetences(temp);
      updateFormik(field, temp.map(c => c.code));
      form.setFieldTouched('competences', true, true);
    }
  };

  const removeCompetence = (index: string) => {
    const reduced_array = competences.filter(
      (_, idx) => idx !== parseInt(index),
    );
    setCompetences(reduced_array);
    updateFormik(field, reduced_array.map(c => c.code));
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
          label={competence.code + ' - ' + competence.description}
          onClick={removeCompetence}
          key={index}
        />
      ))}

      <AsyncDropdown
        idField="code"
        name="CompetencesSearch"
        labelField="code"
        placeholder={t('form.competences.placeholder')}
        label="label"
        apiAction={searchForCompetences}
        onClick={(e: Event) => e.stopPropagation()}
        onChange={addCompetence}
        selectedItems={competences}
        multiSelect
        disableSelected
        onCreate={createNewCompetence}
        onKeyDown={onKeyDown}
      />
    </Fragment>
  );
};

export default injectT(FormikCompetencesContent);
