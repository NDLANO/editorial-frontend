/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import ElementList from '../../NdlaFilm/components/ElementList';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import {
  ArticleType,
  ContentResultType,
  SubjectpageEditType,
  TranslateType,
} from '../../../interfaces';
import handleError from '../../../util/handleError';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpath } from '../../../modules/learningpath/learningpathApi';

interface Props {
  t: TranslateType;
  values: SubjectpageEditType;
  field: FieldProps<ArticleType[]>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const SubjectpageArticles: FC<Props> = ({ t, values, field, form }) => {
  const [articles, setArticles] = useState<ArticleType[]>(
    values.editorsChoices,
  );

  const onAddArticleToList = async (article: ContentResultType) => {
    try {
      let newArticle = undefined;
      if (article.learningResourceType === 'learningpath') {
        newArticle = await fetchLearningpath(article.id);
        newArticle = { ...newArticle, metaImage: article.metaImage };
      }
      else{
        newArticle = await fetchDraft(article.id);
      }
      const temp = [...articles, newArticle];
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

  const updateFormik = (
    formikField: Props['field'],
    newData: ArticleType[],
  ) => {
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
        selectedElements={articles}
        onClick={(e: Event) => e.stopPropagation()}
        onChange={(a: ContentResultType) => onAddArticleToList(a)}
        placeholder={t('subjectpageForm.addArticle')}
        subjectId={values.subjectId}
        clearInputField
      />
    </>
  );
};

export default injectT(SubjectpageArticles);
