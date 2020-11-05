/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { Component } from 'react';
import { injectT } from '@ndla/i18n';
import { Input } from '@ndla/forms';
import styled from '@emotion/styled';
import { tType } from '@ndla/i18n';
import handleError from '../../../util/handleError';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { AsyncDropdown } from '../../../components/Dropdown';
import { groupSearch } from '../../../modules/search/searchApi';
import {
  createResourceFilter,
  createTopicResource,
  fetchResource,
  fetchResourceResourceType,
  queryLearningPathResource,
} from '../../../modules/taxonomy';
import { getResourceIdFromPath } from '../../../util/routeHelpers';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';
import { getArticle } from '../../../modules/article/articleApi';
import {
  learningpathSearch,
  updateLearningPathTaxonomy,
} from '../../../modules/learningpath/learningpathApi';
import ArticlePreview from '../../../components/ArticlePreview';
import { Filter } from '../../../interfaces';
import { LearningPathSearchSummary } from '../../../modules/learningpath/learningpathApiInterfaces';
import { GroupSearchSummary } from '../../../modules/search/searchApiInterfaces';

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

interface Props {
  onClose: () => void;
  type: string;
  allowPaste: boolean;
  topicId: string;
  topicFilters: Filter[];
  refreshResources: () => void;
}

interface ContentType {
  id: string;
  metaDescription?: string;
  title?: string;
  imageUrl?: string;
}

interface SelectedType {
  id: string;
  paths?: string[];
  title?: string;
  url?: string;
  metaUrl?: string;
  description?: string;
  coverPhotoUrl?: string;
}

interface State {
  selected: SelectedType | null;
  content: ContentType | null;
  pastedUrl: string;
  error: string | undefined | null;
  loading: boolean;
}

type SummaryTypes = LearningPathSearchSummary | GroupSearchSummary;

class AddResourceModal extends Component<Props & tType, State> {
  constructor(props: Props & tType) {
    super(props);

    this.state = {
      selected: null,
      content: null,
      pastedUrl: '',
      error: undefined,
      loading: false,
    };
  }

  setNoSelection = () => {
    this.setState({ selected: null, content: null });
  };

  onSelect = (selected: SelectedType) => {
    if (selected) {
      if (selected.url && !selected.url.includes('learningpaths')) {
        const articleId = Number(selected.url.split('/')?.pop());

        if (isNaN(articleId)) {
          return this.setNoSelection();
        }

        this.articleToState(Number(articleId));
      }
      if (selected.metaUrl && selected.metaUrl.includes('learningpaths')) {
        this.learningpathToState(selected);
      }
      this.setState({ selected });
    } else {
      this.setNoSelection();
    }
  };

  onPaste = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const val = evt.target.value;
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
        this.setState({
          selected: { id: val, paths: [val] },
          pastedUrl: val,
          error,
        });
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

  onInputSearch = async (input: string): Promise<SummaryTypes[]> => {
    try {
      if (this.props.type === RESOURCE_TYPE_LEARNING_PATH) {
        const lps = await this.searchLearningpath(input);

        return lps.map(lp => ({
          ...lp,
          metaDescription: lp.description.description,
        }));
      } else {
        return await this.groupSearch(input);
      }
    } catch (err) {
      handleError(err);
      this.setState({ error: err.message });
      return [];
    }
  };

  searchLearningpath = async (
    input: string,
  ): Promise<LearningPathSearchSummary[]> => {
    const query = input
      ? {
          query: input,
          pageSize: 10,
          language: 'nb',
          fallback: true,
          verificationStatus: 'CREATED_BY_NDLA',
        }
      : {
          pageSize: 10,
          language: 'nb',
          fallback: true,
          verificationStatus: 'CREATED_BY_NDLA',
        };
    const res = await learningpathSearch(query);
    return res.results || [];
  };

  groupSearch = async (input: string) => {
    const res = await groupSearch(input, this.props.type);
    return res?.pop()?.results || [];
  };

  articleToState = async (articleId: number) => {
    const article = await getArticle(articleId);

    this.setState({
      content: {
        id: article.id.toString(),
        metaDescription: article.metaDescription.metaDescription,
        title: article.title.title,
        imageUrl: article?.metaImage?.url,
      },
    });
  };

  learningpathToState = (learningpath: SelectedType) => {
    this.setState({
      content: {
        id: learningpath.id,
        metaDescription: learningpath.description,
        title: learningpath.title,
        imageUrl: learningpath.coverPhotoUrl,
      },
    });
  };

  addSelected = async () => {
    const { topicId, refreshResources, onClose, topicFilters } = this.props;
    const { selected } = this.state;
    if (selected?.id) {
      try {
        this.setState({ loading: true });
        const resourceId =
          this.props.type === RESOURCE_TYPE_LEARNING_PATH
            ? await this.findResourceIdLearningPath(Number(selected.id))
            : getResourceIdFromPath(selected?.paths?.[0]);

        await createTopicResource({
          resourceId,
          topicid: topicId,
        });
        if (topicFilters.length > 0) {
          await createResourceFilter({
            filterId: topicFilters[0].id,
            relevanceId: topicFilters[0].relevanceId,
            resourceId,
          });
        }
        refreshResources();
        this.setState({ loading: false });

        onClose();
      } catch (e) {
        handleError(e);
        this.setState({ loading: false, error: e.message });
      }
    }
  };

  findResourceIdLearningPath = async (learningpathId: number) => {
    await updateLearningPathTaxonomy(learningpathId, true);

    try {
      const resource = await queryLearningPathResource(learningpathId);
      if (resource.length > 0) {
        return resource[0].id;
      } else {
        const err = Error(
          `Could not find resource after updating for ${learningpathId}`,
        );
        handleError(err);
        this.setState({ loading: false, error: err.message });
      }
    } catch (err) {
      handleError(err);
      this.setState({ loading: false, error: err.message });
    }
  };

  render() {
    const { onClose, t, allowPaste } = this.props;
    const { selected, content, loading, pastedUrl, error } = this.state;
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
                idField="id"
                name="resourceSearch"
                labelField="title"
                placeholder={t('form.content.relatedArticle.placeholder')}
                label="label"
                apiAction={this.onInputSearch}
                onChange={this.onSelect}
                startOpen
              />
            </React.Fragment>
          )}
          {selected?.id && content?.id && <ArticlePreview article={content} />}
        </StyledContent>
      </TaxonomyLightbox>
    );
  }
}

export default injectT(AddResourceModal);
