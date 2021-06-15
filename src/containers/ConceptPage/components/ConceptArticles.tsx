/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { useFormikContext } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import { AsyncDropdown } from '../../../components/Dropdown';
import handleError from '../../../util/handleError';
import { fetchDraft, searchDrafts } from '../../../modules/draft/draftApi';

import { ArticleType, ContentResultType } from '../../../interfaces';
import { ConceptFormValues } from '../conceptInterfaces';

const ConceptArticles = ({ t }: tType) => {
  const {
    values: { articles, language },
    setFieldValue,
  } = useFormikContext<ConceptFormValues>();
  const onAddArticleToList = async (article: ContentResultType) => {
    try {
      const newArticle = await fetchDraft(article.id);
      const temp = [...articles, newArticle];
      if (newArticle !== undefined) {
        setFieldValue('articles', temp);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (articleList: ArticleType[]) => {
    setFieldValue('articles', articleList);
  };

  const searchForArticles = async (input: string) => {
    return searchDrafts({
      query: input,
      language: language,
    });
  };

  return (
    <>
      <FieldHeader title={t('form.related.title')} subTitle={t('subjectpageForm.articles')} />
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
        multiSelect
        disableSelected
        clearInputField
      />
    </>
  );
};

export default injectT(ConceptArticles);
