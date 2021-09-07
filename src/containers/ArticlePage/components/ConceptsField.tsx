/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { FormikHelpers, FormikValues } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import { FormikProperties } from '../../../interfaces';
import handleError from '../../../util/handleError';
import { fetchConcept, searchConcepts } from '../../../modules/concept/conceptApi';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { ApiConceptType, CoreApiConceptType } from '../../../modules/concept/conceptApiInterfaces';

interface Props {
  locale: string;
  values: {
    conceptIds: ApiConceptType[];
  };
  field: FormikProperties['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const ConceptsField = ({ locale, values, field, form }: Props) => {
  const { t } = useTranslation();
  const [concepts, setConcepts] = useState<CoreApiConceptType[]>(values.conceptIds);

  const onAddConceptToList = async (concept: CoreApiConceptType) => {
    try {
      const newConcept = await fetchConcept(concept.id, locale);
      const temp = [...concepts, { ...newConcept, articleType: 'concept' }];
      setConcepts(temp);
      updateFormik(field, temp);
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (conceptList: CoreApiConceptType[]) => {
    setConcepts(conceptList);
    updateFormik(field, conceptList);
  };

  const updateFormik = (formikField: Props['field'], newData: CoreApiConceptType[]) => {
    form.setFieldTouched('conceptIds', true, false);
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const searchForConcepts = async (query: string, page?: number) => {
    return searchConcepts({
      query,
      page,
      language: locale,
    });
  };

  return (
    <>
      <FieldHeader title={t('form.relatedConcepts.articlesTitle')} />
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
        labelField="title"
        placeholder={t('form.relatedConcepts.placeholder')}
        apiAction={searchForConcepts}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={onAddConceptToList}
        multiSelect
        disableSelected
        clearInputField
        showPagination
      />
    </>
  );
};

export default ConceptsField;
