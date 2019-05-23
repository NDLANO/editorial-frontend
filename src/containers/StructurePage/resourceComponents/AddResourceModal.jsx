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
  updateTopic,
} from '../../../modules/taxonomy';
import { getResourceIdFromPath } from '../../../util/routeHelpers';

import { getArticle } from '../../../modules/article/articleApi';
import { learningpathSearch } from '../../../modules/learningpath/learningpathApi';
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
  }

  onSelect = selected => {
    console.log(selected);
    if (selected) {
      if (selected.url && !selected.url.includes('learningpaths')) {
        const articleId = selected.url.split('/').pop();
        this.articleToState(articleId);
      }
      this.setState({ selected });
    } else {
      this.setState({ selected: {}, article: {} });
    }
  };

  onPaste = async e => {
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
  };

  onInputSearch = async input => {
    try {
      const result =
        this.props.type === 'urn:resourcetype:learningPath'
          ? await this.searchLearningpath(input)
          : await this.groupSearch(input);
      return result.map(current => ({
        ...current,
        title: current.title ? current.title.title : '',
      }));
    } catch (e) {
      handleError(e);
      this.setState({ error: e.message });
      return [];
    }
  };

  searchLearningpath = async input => {
    const query = {
      query: input,
      pageSize: 10,
      language: 'nb',
      fallback: true,
    };
    const res = await learningpathSearch(query);
    return res.results ? res.results : [];
  };

  groupSearch = async input => {
    const res = await groupSearch(input, this.props.type);
    return res.length > 0 ? res.pop().results : [];
  };

  articleToState = async articleId => {
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
  };

  addSelected = async () => {
    const { topicId, refreshResources, onClose } = this.props;
    const { selected } = this.state;
    if (selected.id) {
      try {
        this.setState({ loading: true });
        console.log(selected);
        await updateTopic({
          id: selected.id,
          name: selected.title,
          contentUri: `urn:learningpath:${selected.id}`,
        });
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
  };

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
  topicId: PropTypes.string.isRequired,
  refreshResources: PropTypes.func.isRequired,
};

export default injectT(AddResourceModal);
