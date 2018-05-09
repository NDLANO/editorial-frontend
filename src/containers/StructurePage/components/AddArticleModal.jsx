import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { updateTopic } from '../../../modules/taxonomy';
import TaxonomyLightbox from './TaxonomyLightbox';
import { AsyncDropdown } from '../../../components/Dropdown';
import { searchRelatedArticles } from '../../../modules/article/articleApi';

class AddArticleModal extends Component {
  constructor() {
    super();
    this.onArticleSearch = this.onArticleSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }
  async onArticleSearch(input) {
    try {
      const results = await searchRelatedArticles(
        input,
        this.props.locale,
        'topic-article',
      );
      return results;
    } catch (e) {
      console.log(e);
    }
  }

  async onSelect(article) {
    try {
      const { currentTopic, refreshTopics, toggleAddModal } = this.props;
      const ok = await updateTopic({
        id: currentTopic.id,
        name: currentTopic.name,
        contentUri: `urn:article:${article.id}`,
      });
      if (ok) {
        refreshTopics();
        toggleAddModal();
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { t, toggleAddModal } = this.props;
    return (
      <TaxonomyLightbox
        title={t('taxonomy.searchArticle')}
        onClose={toggleAddModal}>
        <AsyncDropdown
          valueField="id"
          name="resourceSearch"
          textField="title.title"
          placeholder={t('form.content.relatedArticle.placeholder')}
          label="label"
          apiAction={this.onArticleSearch}
          messages={{
            emptyFilter: '',
            emptyList: t('taxonomy.noResources'),
          }}
          onChange={this.onSelect}
          alwaysOpen
        />
      </TaxonomyLightbox>
    );
  }
}

AddArticleModal.propTypes = {
  locale: PropTypes.string,
  toggleAddModal: PropTypes.func,
};

export default injectT(AddArticleModal);
