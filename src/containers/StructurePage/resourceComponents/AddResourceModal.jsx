import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Input } from '@ndla/forms';
import styled from '@emotion/styled';
import handleError from '../../../util/handleError';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { AsyncDropdown } from '../../../components/Dropdown';
import { groupSearch } from '../../../modules/search/searchApi';
import {
  createTopicResource,
  fetchResource,
  fetchResourceResourceType,
} from '../../../modules/taxonomy';
import { getResourceIdFromPath } from '../../../util/routeHelpers';

import { getArticle } from '../../../modules/article/articleApi';
import ArticlePreview from '../../../components/ArticlePreview';

const StyledOrDivider = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const StyledContent = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }

  & form {
    background-color: white;
  }
`;
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
    this.onInputSearch = this.onInputSearch.bind(this);
  }

  onSelect(selected) {
    if (selected) {
      if (!selected.url.includes('learningpaths')) {
        const articleId = selected.url.split('/').pop();
        this.articleToState(articleId);
      }
      this.setState({ selected });
    } else {
      this.setState({ selected: {}, article: {} });
    }
  }

  async onPaste(e) {
    const val = e.target.value;
    const { type, t } = this.props;
    const resourceId = getResourceIdFromPath(val);

    if (resourceId) {
      try {
        const [resource, resourceType] = await Promise.all([
          fetchResource(resourceId),
          fetchResourceResourceType(resourceId),
        ]);
        this.articleToState(resource.contentUri.split(':').pop());
        const pastedType = resourceType.length > 0 && resourceType[0].id;
        const error =
          pastedType === type ? '' : `${t('taxonomy.wrongType')} ${pastedType}`;
        this.setState({ selected: { id: val }, pastedUrl: val, error });
      } catch (error) {
        handleError(error);
        this.setState({ error: error.message });
      }
    } else if (!val) {
      this.setState({ error: '', pastedUrl: val });
    } else {
      this.setState({ error: t('errorMessage.invalidUrl'), pastedUrl: val });
    }
  }

  onInputSearch = async input => {
    try {
      const res = await groupSearch(input, this.props.type);
      const result = res.length > 0 ? res.pop().results : [];
      return result;
    } catch (e) {
      handleError(e);
      this.setState({ error: e.message });
      return [];
    }
  };

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
          resourceId: getResourceIdFromPath(selected.paths[0]),
          topicid: topicId,
        });
        refreshResources();
        this.setState({ loading: false });

        onClose();
      } catch (e) {
        handleError(e);
        this.setState({ loading: false, error: e.message });
      }
    }
  }

  render() {
    const { onClose, t, allowPaste } = this.props;
    const { selected, article, loading, pastedUrl, error } = this.state;

    return (
      <TaxonomyLightbox
        title={t('taxonomy.searchResource')}
        onSelect={this.addSelected}
        loading={loading}
        onClose={onClose}>
        <StyledContent>
          {allowPaste && (
            <Input
              type="text"
              data-testid="addResourceUrlInput"
              value={pastedUrl}
              onChange={this.onPaste}
              placeholder={t('taxonomy.urlPlaceholder')}
            />
          )}
          {error && <span className="c-errorMessage">{error}</span>}

          {!pastedUrl && (
            <React.Fragment>
              {allowPaste && (
                <StyledOrDivider>{t('taxonomy.or')}</StyledOrDivider>
              )}
              <AsyncDropdown
                valueField="id"
                name="resourceSearch"
                textField="title"
                placeholder={t('form.content.relatedArticle.placeholder')}
                label="label"
                apiAction={this.onInputSearch}
                onChange={this.onSelect}
                startOpen
              />
            </React.Fragment>
          )}
          {selected.id && article.id && <ArticlePreview article={article} />}
        </StyledContent>
      </TaxonomyLightbox>
    );
  }
}

AddResourceModal.propTypes = {
  onClose: PropTypes.func,
  type: PropTypes.string,
  allowPaste: PropTypes.bool,
};

export default injectT(AddResourceModal);
