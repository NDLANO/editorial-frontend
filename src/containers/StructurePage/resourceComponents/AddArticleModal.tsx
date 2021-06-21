import React from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { updateTopic } from '../../../modules/taxonomy';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { AsyncDropdown } from '../../../components/Dropdown';
import { searchRelatedArticles } from '../../../modules/article/articleApi';
import handleError from '../../../util/handleError';
import { TopicShape } from '../../../shapes';
import { ResourceWithTopicConnection } from '../../../interfaces';

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
  currentTopic: ResourceWithTopicConnection;
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
      const results = await searchRelatedArticles(input, locale, 'topic-article');
      return results;
    } catch (err) {
      handleError(err);
    }
    return [];
  };

  const onSelect = async (article: any) => {
    //fix any type
    try {
      const topicUpdated = await updateTopic({
        id: currentTopic.id,
        name: currentTopic.name,
        contentUri: `urn:article:${article.id}`,
      });
      if (topicUpdated) {
        refreshTopics();
        toggleAddModal();
      }
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

AddArticleModal.propTypes = {
  locale: PropTypes.string.isRequired,
  toggleAddModal: PropTypes.func.isRequired,
  refreshTopics: PropTypes.func.isRequired,
  currentTopic: TopicShape,
};

export default injectT(AddArticleModal);
