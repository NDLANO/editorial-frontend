import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import TaxonomyLightbox from './TaxonomyLightbox';
import { AsyncDropdown } from '../../../components/Dropdown';
import { groupSearch } from '../../../modules/search/searchApi';
import { createTopicResource } from '../../../modules/taxonomy';
import { getResourceIdFromPath } from '../../../util/routeHelpers';

import { getArticle } from '../../../modules/article/articleApi';
import ArticlePreview from './ArticlePreview';

class AddResourceModal extends Component {
  constructor() {
    super();
    this.state = {
      selected: {},
      article: {},
    };
    this.onSelect = this.onSelect.bind(this);
    this.addSelected = this.addSelected.bind(this);
  }

  async onSelect(selected) {
    if (selected) {
      const articleId = selected.url.split('/').pop();
      const {
        id,
        metaDescription = {},
        title = {},
        metaImage = {},
      } = await getArticle(articleId);
      this.setState({
        selected,
        article: {
          id,
          metaDescription: metaDescription.metaDescription,
          title: title.title,
          imageUrl: metaImage.url,
        },
      });
    } else {
      this.setState({ selected: {}, article: {} });
    }
  }

  async addSelected() {
    const { topicId, refreshResources, onClose } = this.props;
    const { selected } = this.state;
    if (selected.id) {
      try {
        this.setState({ loading: true });
        await createTopicResource({
          resourceId: getResourceIdFromPath(selected.id),
          topicid: `urn:${topicId}`,
        });
        refreshResources();
        this.setState({ loading: false });
        onClose();
      } catch (e) {
        console.log(e);
      }
    }
  }

  render() {
    const { onClose, type, t } = this.props;
    const { selected, article, loading } = this.state;

    return (
      <TaxonomyLightbox
        title={t('taxonomy.searchResource')}
        onSelect={this.addSelected}
        loading={loading}
        onClose={onClose}>
        <AsyncDropdown
          valueField="id"
          name="resourceSearch"
          textField="title"
          placeholder={t('form.content.relatedArticle.placeholder')}
          label="label"
          apiAction={async inp => {
            const res = await groupSearch(inp, type);
            const result = res.length > 0 ? res.pop().results : [];
            return result.map(curr => ({
              ...curr,
              id: curr.paths.pop(),
              title: curr.title ? curr.title.title : '',
            }));
          }}
          messages={{
            emptyFilter: t('form.content.relatedArticle.emptyFilter'),
            emptyList: t('form.content.relatedArticle.emptyList'),
          }}
          onChange={this.onSelect}
          alwaysOpen
        />
        {selected.id && <ArticlePreview article={article} />}
      </TaxonomyLightbox>
    );
  }
}

AddResourceModal.propTypes = {
  onClose: PropTypes.func,
  type: PropTypes.string,
};

export default injectT(AddResourceModal);
