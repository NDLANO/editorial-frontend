/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { IConcept, IConceptSummary } from '@ndla/types-concept-api';
import { FieldInputProps, FormikHelpers } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import handleError from '../../../util/handleError';
import { fetchConcept, searchConcepts } from '../../../modules/concept/conceptApi';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { ArticleFormType } from '../../FormikForm/articleFormHooks';

interface ConceptApiTypeWithArticleType extends IConcept {
  articleType?: string;
}
interface Props {
  field: FieldInputProps<ArticleFormType['conceptIds']>;
  form: FormikHelpers<ArticleFormType>;
}

const ConceptsField = ({ field, form }: Props) => {
  const { t, i18n } = useTranslation();
  const [concepts, setConcepts] = useState<ConceptApiTypeWithArticleType[]>([]);

  useEffect(() => {
    (async () => {
      const conceptPromises = field.value.filter(a => !!a).map(id => fetchConcept(id, ''));
      const fetchedConcepts = await Promise.all(conceptPromises);
      setConcepts(fetchedConcepts.map(concept => ({ ...concept, articleType: 'concept' })));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddConceptToList = async (concept: IConceptSummary) => {
    try {
      const newConcept = await fetchConcept(concept.id, i18n.language);
      const temp = [...concepts, { ...newConcept, articleType: 'concept' }];
      setConcepts(temp);
      updateFormik(field, temp);
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (conceptList: ConceptApiTypeWithArticleType[]) => {
    setConcepts(conceptList);
    updateFormik(field, conceptList);
  };

  const updateFormik = (formikField: Props['field'], newData: ConceptApiTypeWithArticleType[]) => {
    form.setFieldTouched('conceptIds', true, false);
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData.map(c => c.id) || null,
      },
    });
  };

  const searchForConcepts = async (query: string, page?: number) => {
    return searchConcepts({
      query,
      page,
      language: i18n.language,
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
      <AsyncDropdown<IConceptSummary>
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
