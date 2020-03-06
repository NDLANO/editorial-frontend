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
import { fetchCompetences } from '../../modules/draft/draftApi';
import { fetchCompetenceTitle } from '../../modules/grep/grepApi';
import { AsyncDropdown } from '../../components/Dropdown';
import { isCompetenceValid } from '../../util/articleUtil';
import { TranslateType } from '../../interfaces';
import FormikFieldDescription from '../../components/FormikField/FormikFieldDescription';

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
  title: string | undefined | null;
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
          title: await fetchCompetenceTitle(c),
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

  const createNewCompetence = async (competenceCode: string) => {
    const competence = competenceCode.toUpperCase();
    const comp = await fetchCompetenceTitle(competence);
    if (
      comp &&
      !competences.filter(c => c.code === competence).length &&
      isCompetenceValid(competence)
    ) {
      const temp = [
        ...competences,
        {
          code: competence,
          title: comp,
        },
      ];
      setCompetences(temp);
      updateFormik(
        field,
        temp.map(c => c.code),
      );
      form.setFieldTouched('competences', true, true);
    }
  };

  const removeCompetence = (index: string) => {
    const reduced_array = competences.filter(
      (_, idx) => idx !== parseInt(index),
    );
    setCompetences(reduced_array);
    updateFormik(
      field,
      reduced_array.map(c => c.code),
    );
    form.setFieldTouched('competences', true, true);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const isTitleTooLong = (title: string | undefined | null) => {
    return title
      ? title.length >= 100
        ? title.slice(0, 100) + '...'
        : title
      : t('form.competences.titleNotFound');
  };

  return (
    <Fragment>
      <FormikFieldDescription description={t('form.competences.description')} />
      <AsyncDropdown
        idField="code"
        name="CompetencesSearch"
        labelField="code"
        placeholder={t('form.competences.placeholder')}
        label="label"
        apiAction={searchForCompetences}
        onClick={(e: Event) => e.stopPropagation()}
        onChange={(c: Competence) => createNewCompetence(c.code)}
        selectedItems={competences}
        multiSelect
        disableSelected
        onCreate={createNewCompetence}
        onKeyDown={onKeyDown}
        positionAbsolute
      />

      {competences.map((competence, index) => (
        <FormPill
          id={index.toString()}
          label={`${competence.code} - ${isTitleTooLong(competence.title)}`}
          onClick={removeCompetence}
          key={index}
        />
      ))}
    </Fragment>
  );
};

export default injectT(FormikCompetencesContent);
