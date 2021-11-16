/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { FormikHelpers, FormikValues } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import { ArticleType, ContentResultType, FormikProperties } from '../../../interfaces';
import handleError from '../../../util/handleError';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpath } from '../../../modules/learningpath/learningpathApi';

interface Props {
  editorsChoices: ArticleType[];
  elementId: string;
  field: FormikProperties['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const getSubject = (elementId: string) => {
  if (elementId.includes('subject')) {
    return elementId;
  }
  return undefined;
};

const SubjectpageArticles = ({ editorsChoices, elementId, field, form }: Props) => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<ArticleType[]>(editorsChoices);
  const subjectId = getSubject(elementId);

  const onAddArticleToList = async (article: ContentResultType) => {
    try {
      let newArticle = undefined;
      if (article.learningResourceType === 'learningpath') {
        newArticle = await fetchLearningpath(article.id);
        newArticle = { ...newArticle, metaImage: article.metaImage };
      } else {
        newArticle = await fetchDraft(article.id);
      }
      // @ts-ignore TODO Temporary ugly hack for mismatching Article types, should be fixed when ConceptForm.jsx -> tsx
      const temp = [...articles, newArticle] as ArticleType[];
      if (newArticle !== undefined) {
        setArticles(temp);
        updateFormik(field, temp);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (articleList: ArticleType[]) => {
    setArticles(articleList);
    updateFormik(field, articleList);
  };

  const updateFormik = (formikField: Props['field'], newData: ArticleType[]) => {
    form.setFieldTouched('editorsChoices', true, false);
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  return (
    <>
      <FieldHeader
        title={t('subjectpageForm.editorsChoices')}
        subTitle={t('subjectpageForm.articles')}
      />
      <ElementList
        elements={articles}
        data-cy="editors-choices-article-list"
        messages={{
          dragElement: t('form.file.changeOrder'),
          removeElement: t('subjectpageForm.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      <DropdownSearch
        //@ts-ignore This is poorly typed.
        selectedElements={articles}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={(article: ContentResultType) => onAddArticleToList(article)}
        placeholder={t('subjectpageForm.addArticle')}
        subjectId={subjectId}
        clearInputField
      />
    </>
  );
};

export default SubjectpageArticles;
