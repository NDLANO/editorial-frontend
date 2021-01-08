/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { FormikHelpers, FormikValues } from 'formik';
import ElementList from '../NdlaFilm/components/ElementList';
import { AsyncDropdown } from '../../components/Dropdown';
import { Concept, ContentResultType, FormikProperties } from '../../interfaces';
import handleError from '../../util/handleError';
import { fetchConcept, searchConcepts } from '../../modules/concept/conceptApi';

interface Props {
  locale: String;
  values: {
    conceptIds: Concept[];
  };
  field: FormikProperties['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const FormikConcepts: FC<Props & tType> = ({
  locale,
  t,
  values,
  field,
  form,
}) => {
  const [concepts, setConcepts] = useState<Concept[]>(values.conceptIds);
  const onAddConceptToList = async (concept: ContentResultType) => {
    try {
      let newConcept = await fetchConcept(concept.id);
      const temp = [...concepts, newConcept];
      if (newConcept !== undefined) {
        setConcepts(temp);
        updateFormik(field, temp);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (conceptList: Concept[]) => {
    setConcepts(conceptList);
    updateFormik(field, conceptList);
  };

  const updateFormik = (formikField: Props['field'], newData: Concept[]) => {
    form.setFieldTouched('conceptIds', true, false);
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const searchForConcepts = async (inp: String) => {
    return await searchConcepts({
      query: inp,
      language: locale,
    });
  };

  return (
    <>
      <FieldHeader
        title={t('form.relatedConcepts.articlesTitle')}
        subTitle={t('form.relatedConcepts.articlesSubtitle')}
      />
      <ElementList
        elements={concepts}
        messages={{
          dragElement: t('form.relatedConcepts.changeOrder'),
          removeElement: t('form.relatedConcepts.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      <AsyncDropdown
        selectedItems={concepts}
        idField="id"
        name="relatedConceptsSearch"
        labelField="title"
        placeholder={t('form.relatedConcepts.placeholder')}
        label="label"
        apiAction={searchForConcepts}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={(concept: ContentResultType) => onAddConceptToList(concept)}
        multiSelect
        clearInputField
      />
    </>
  );
};

export default injectT(FormikConcepts);
