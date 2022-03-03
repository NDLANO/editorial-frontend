/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ISearchResultV2, IArticleSummaryV2 } from '@ndla/types-article-api';
import { updateTopic } from '../../../modules/taxonomy';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { searchRelatedArticles } from '../../../modules/article/articleApi';
import handleError from '../../../util/handleError';
import { SubjectTopic } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType } from '../../../interfaces';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';

const StyledContent = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }

  & form {
    background-color: white;
  }
`;

interface Props {
  locale: string;
  toggleAddModal: () => void;
  refreshTopics: () => Promise<void>;
  currentTopic: SubjectTopic;
}

const AddArticleModal = ({ locale, toggleAddModal, refreshTopics, currentTopic }: Props) => {
  const { t } = useTranslation();
  const onArticleSearch = async (input: string): Promise<ISearchResultV2> => {
    try {
      const results = await searchRelatedArticles(input, locale as LocaleType, 'topic-article');
      return results;
    } catch (err) {
      handleError(err);
    }
    return {
      pageSize: 10,
      totalCount: 0,
      page: 0,
      language: '',
      results: [],
    };
  };

  const onSelect = async (article: IArticleSummaryV2) => {
    try {
      await updateTopic({
        id: currentTopic.id,
        name: currentTopic.name,
        contentUri: `urn:article:${article.id}`,
      });
      await refreshTopics();
      toggleAddModal();
    } catch (err) {
      handleError(err);
    }
  };
  return (
    <TaxonomyLightbox title={t('taxonomy.searchArticle')} onClose={toggleAddModal}>
      <StyledContent>
        <AsyncDropdown
          idField="id"
          labelField="title.title"
          placeholder={t('form.content.relatedArticle.placeholder')}
          apiAction={(input, _) => onArticleSearch(input)}
          onChange={onSelect}
          startOpen
        />
      </StyledContent>
    </TaxonomyLightbox>
  );
};

export default AddArticleModal;
