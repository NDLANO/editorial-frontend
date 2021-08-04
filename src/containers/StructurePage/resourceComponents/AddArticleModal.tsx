import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { updateTopic } from '../../../modules/taxonomy';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { AsyncDropdown } from '../../../components/Dropdown';
import { searchRelatedArticles } from '../../../modules/article/articleApi';
import handleError from '../../../util/handleError';
import { SubjectTopic } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType } from '../../../interfaces';
import { ArticleSearchSummaryApiType } from '../../../modules/article/articleApiInterfaces';

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

const AddArticleModal = ({
  locale,
  toggleAddModal,
  refreshTopics,
  currentTopic,
  t,
}: Props & tType) => {
  const onArticleSearch = async (input: string) => {
    try {
      const results = await searchRelatedArticles(input, locale as LocaleType, 'topic-article');
      return results;
    } catch (err) {
      handleError(err);
    }
    return [];
  };

  const onSelect = async (article: ArticleSearchSummaryApiType) => {
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
          name="resourceSearch"
          labelField="title.title"
          placeholder={t('form.content.relatedArticle.placeholder')}
          label="label"
          apiAction={onArticleSearch}
          onChange={onSelect}
          startOpen
        />
      </StyledContent>
    </TaxonomyLightbox>
  );
};

export default injectT(AddArticleModal);
