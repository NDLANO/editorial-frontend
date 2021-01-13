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
import ElementList from '../../NdlaFilm/components/ElementList';
import { AsyncDropdown } from '../../../components/Dropdown';
import {
  ArticleType,
  ContentResultType,
  FormikProperties,
} from '../../../interfaces';
import handleError from '../../../util/handleError';
import { fetchDraft, searchDrafts } from '../../../modules/draft/draftApi';

interface Props {
  locale: String;
  articleIds: ArticleType[];
  field: FormikProperties['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const ConceptArticles: FC<Props & tType> = ({
  locale,
  t,
  articleIds,
  field,
  form,
}) => {
  const [articles, setArticles] = useState<ArticleType[]>(articleIds);
  const onAddArticleToList = async (article: ContentResultType) => {
    try {
      let newArticle = await fetchDraft(article.id);
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
    form.setFieldTouched('articleIds', true, false);
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const searchForArticles = async (inp: String) => {
    return await searchDrafts({
      query: inp,
      language: locale,
    });
  };

  return (
    <>
      <FieldHeader
        title={t('conceptpageForm.articlesTitle')}
        subTitle={t('conceptpageForm.articlesSubtitle')}
      />
      <ElementList
        elements={articles}
        messages={{
          dragElement: t('conceptpageForm.changeOrder'),
          removeElement: t('conceptpageForm.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      <AsyncDropdown
        selectedItems={articles}
        idField="id"
        name="relatedArticleSearch"
        labelField="title"
        placeholder={t('form.content.relatedArticle.placeholder')}
        label="label"
        apiAction={searchForArticles}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={(article: ContentResultType) => onAddArticleToList(article)}
        clearInputField
      />
    </>
  );
};

export default injectT(ConceptArticles);
