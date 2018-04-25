import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import TaxonomyLightbox from './TaxonomyLightbox';
import { AsyncDropdown } from '../../../components/Dropdown';
import { groupSearch } from '../../../modules/search/searchApi';
import {
  createTopicResource,
  fetchResource,
  fetchResourceResourceType,
} from '../../../modules/taxonomy';
import { getResourceIdFromPath } from '../../../util/routeHelpers';

import { getArticle } from '../../../modules/article/articleApi';
import ArticlePreview from './ArticlePreview';

class AddResourceModal extends Component {
  constructor() {
    super();
    this.state = {
      selected: {},
      article: {},
      pastedUrl: '',
    };
    this.onSelect = this.onSelect.bind(this);
    this.addSelected = this.addSelected.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.articleToState = this.articleToState.bind(this);
  }

  onSelect(selected) {
    if (selected) {
      const articleId = selected.url.split('/').pop();
      this.articleToState(articleId);
      this.setState({ selected });
    } else {
      this.setState({ selected: {}, article: {} });
    }
  }

  async onPaste(e) {
    const val = e.target.value;
    const resourceId = getResourceIdFromPath(val);

    if (resourceId) {
      try {
        const [resource, resourceType] = await Promise.all([
          fetchResource(resourceId),
          fetchResourceResourceType(resourceId),
        ]);
        this.articleToState(resource.contentUri.split(':').pop());
        const type = resourceType.length > 0 && resourceType[0].id;
        const error =
          type === this.props.type
            ? ''
            : `${this.props.t('taxonomy.wrongType')} ${type}`;
        this.setState({ selected: { id: val }, pastedUrl: val, error });
      } catch (error) {
        console.log(error);
      }
    } else if (!val) {
      this.setState({ error: '', pastedUrl: val });
    } else {
      this.setState({ error: 'Invalid url', pastedUrl: val });
    }
  }

  async articleToState(articleId) {
    const {
      id,
      metaDescription = {},
      title = {},
      metaImage = {},
    } = await getArticle(articleId);
    this.setState({
      article: {
        id,
        metaDescription: metaDescription.metaDescription,
        title: title.title,
        imageUrl: metaImage.url,
      },
    });
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
        this.setState({ loading: false, error: e.message });
      }
    }
  }

  render() {
    const { onClose, type, t } = this.props;
    const { selected, article, loading, pastedUrl, error } = this.state;

    return (
      <TaxonomyLightbox
        title={t('taxonomy.searchResource')}
        onSelect={this.addSelected}
        loading={loading}
        onClose={onClose}>
        <input
          type="text"
          data-testid="addResourceUrlInput"
          value={pastedUrl}
          onChange={this.onPaste}
          placeholder={t('taxonomy.urlPlaceholder')}
        />
        {error && <span className="c-errorMessage">{error}</span>}

        {!pastedUrl && (
          <React.Fragment>
            <span
              style={{
                color: 'white',
                alignSelf: 'center',
              }}>
              {t('taxonomy.or')}
            </span>
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
                emptyFilter: '',
                emptyList: t('taxonomy.noResources'),
              }}
              onChange={this.onSelect}
              alwaysOpen
            />
          </React.Fragment>
        )}
        {selected.id && article.id && <ArticlePreview article={article} />}
      </TaxonomyLightbox>
    );
  }
}

AddResourceModal.propTypes = {
  onClose: PropTypes.func,
  type: PropTypes.string,
};

export default injectT(AddResourceModal);
