/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { useFormikContext } from 'formik';
import { IArticle, IArticleSummary } from '@ndla/types-draft-api';
import ElementList from '../../FormikForm/components/ElementList';
import handleError from '../../../util/handleError';
import { fetchDraft, searchDrafts } from '../../../modules/draft/draftApi';
import { ConceptFormValues } from '../conceptInterfaces';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';

const ConceptArticles = () => {
  const { t } = useTranslation();
  const {
    values: { articles, language },
    setFieldValue,
  } = useFormikContext<ConceptFormValues>();

  const onAddArticleToList = async (article: IArticleSummary) => {
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

  const onUpdateElements = (articleList: IArticle[]) => {
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
        labelField="title"
        placeholder={t('form.content.relatedArticle.placeholder')}
        apiAction={searchForArticles}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={onAddArticleToList}
        multiSelect
        disableSelected
        clearInputField
      />
    </>
  );
};

export default ConceptArticles;
