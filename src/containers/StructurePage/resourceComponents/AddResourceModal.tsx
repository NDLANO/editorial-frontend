/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useState } from 'react';
import { injectT } from '@ndla/i18n';
import { Input } from '@ndla/forms';
import styled from '@emotion/styled';
import { tType } from '@ndla/i18n';
import ResourceTypeSelect from '../../ArticlePage/components/ResourceTypeSelect';
import handleError from '../../../util/handleError';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { groupSearch } from '../../../modules/search/searchApi';
import {
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
import {
  LearningPathSearchResult,
  LearningPathSearchSummary,
} from '../../../modules/learningpath/learningpathApiInterfaces';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { GroupSearchResult, GroupSearchSummary } from '../../../modules/search/searchApiInterfaces';

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
  resourceTypes: {
    id: string;
    name: string;
  }[];
  type?: string;
  allowPaste?: boolean;
  topicId: string;
  refreshResources: () => void;
}

interface ContentType {
  id: number;
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

const AddResourceModal = ({
  onClose,
  type,
  resourceTypes,
  allowPaste,
  topicId,
  refreshResources,
  t,
}: Props & tType) => {
  const [selectedType, setSelectedType] = useState<string | undefined>(type);
  const [selected, setSelected] = useState<SelectedType | null>(null);
  const [content, setContent] = useState<ContentType | null>(null);
  const [pastedUrl, setPastedUrl] = useState('');
  const [error, setError] = useState<string | undefined | null>(undefined);
  const [loading, setLoading] = useState(false);

  const setNoSelection = () => {
    setSelected(null);
    setContent(null);
  };

  const paste = allowPaste || selectedType !== RESOURCE_TYPE_LEARNING_PATH;

  const onSelect = (selected?: SelectedType) => {
    if (selected) {
      if (selected.url && !selected.url.includes('learningpaths')) {
        const articleId = Number(selected.url.split('/')?.pop());

        if (isNaN(articleId)) {
          return setNoSelection();
        }

        articleToState(Number(articleId));
      }
      if (selected.metaUrl && selected.metaUrl.includes('learningpaths')) {
        learningpathToState(selected);
      }
      setSelected(selected);
    } else {
      setNoSelection();
    }
  };

  const onPaste = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const val = evt.target.value;
    const resourceId = getResourceIdFromPath(val);

    if (resourceId) {
      try {
        const [resource, resourceType] = await Promise.all([
          fetchResource(resourceId),
          fetchResourceResourceType(resourceId),
        ]);
        if (resource.contentUri) {
          articleToState(parseInt(resource.contentUri.split(':').pop()!));
        }

        const pastedType = resourceType.length > 0 && resourceType[0].id;
        const error = pastedType === selectedType ? '' : `${t('taxonomy.wrongType')} ${pastedType}`;
        setSelected({ id: val, paths: [val] });
        setPastedUrl(val);
        setError(error);
      } catch (error) {
        handleError(error);
        setError(error.message);
      }
    } else if (!val) {
      setError('');
      setPastedUrl(val);
    } else {
      setError(t('errorMessage.invalidUrl'));
      setPastedUrl(val);
    }
  };

  const onInputSearch = async (
    input: string,
    type: string,
  ): Promise<LearningPathSearchResult | GroupSearchResult> => {
    try {
      if (type === RESOURCE_TYPE_LEARNING_PATH) {
        const lps = await searchLearningpath(input);
        const results = lps.results.map(lp => ({
          ...lp,
          metaDescription: lp.description.description,
        }));
        return { ...lps, results };
      } else {
        const searchResult = await searchGroups(input, type);
        if (!searchResult) {
          return {
            totalCount: 0,
            page: 0,
            pageSize: 0,
            language: '',
            results: [],
            resourceType: '',
          };
        }
        return searchResult;
      }
    } catch (err) {
      handleError(err);
      setError(err.message);
      return {
        totalCount: 0,
        page: 0,
        pageSize: 0,
        language: '',
        results: [],
        resourceType: '',
      };
    }
  };

  const searchLearningpath = async (input: string): Promise<LearningPathSearchResult> => {
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
    return res;
  };

  const searchGroups = async (input: string, type: string) => {
    const res = await groupSearch(input, type);
    return res.pop();
  };

  const articleToState = async (articleId: number) => {
    const article = await getArticle(articleId);
    setContent({
      id: article.id,
      metaDescription: article.metaDescription.metaDescription,
      title: article.title.title,
      imageUrl: article?.metaImage?.url,
    });
  };

  const learningpathToState = (learningpath: SelectedType) => {
    setContent({
      id: Number(learningpath.id),
      metaDescription: learningpath.description,
      title: learningpath.title,
      imageUrl: learningpath.coverPhotoUrl,
    });
  };

  const addSelected = async () => {
    if (selected?.id) {
      try {
        setLoading(true);
        const resourceId =
          selectedType === RESOURCE_TYPE_LEARNING_PATH
            ? await findResourceIdLearningPath(Number(selected.id))
            : getResourceIdFromPath(selected?.paths?.[0]);

        if (!resourceId) {
          return;
        }

        await createTopicResource({
          resourceId,
          topicid: topicId,
        });
        refreshResources();
        setLoading(false);

        onClose();
      } catch (e) {
        handleError(e);
        setLoading(false);
        setError(e.message);
      }
    }
  };

  const findResourceIdLearningPath = async (learningpathId: number) => {
    await updateLearningPathTaxonomy(learningpathId, true);

    try {
      const resource = await queryLearningPathResource(learningpathId);
      if (resource.length > 0) {
        return resource[0].id;
      } else {
        const err = Error(`Could not find resource after updating for ${learningpathId}`);
        handleError(err);
        setLoading(false);
        setError(err.message);
      }
    } catch (err) {
      handleError(err);
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <TaxonomyLightbox
      title={t('taxonomy.searchResource')}
      onSelect={addSelected}
      loading={loading}
      onClose={onClose}>
      <StyledContent>
        {!type && (
          <ResourceTypeSelect
            availableResourceTypes={resourceTypes}
            resourceTypes={selectedType ? [selectedType] : []}
            onChangeSelectedResource={(e: { target: { value: string } }) => {
              setSelectedType(e.target.value);
            }}
          />
        )}
        {paste && selectedType && (
          <Input
            type="text"
            data-testid="addResourceUrlInput"
            value={pastedUrl}
            onChange={onPaste}
            placeholder={t('taxonomy.urlPlaceholder')}
          />
        )}
        {error && <span className="c-errorMessage">{error}</span>}

        {!pastedUrl && selectedType && (
          <React.Fragment>
            {paste && <StyledOrDivider>{t('taxonomy.or')}</StyledOrDivider>}
            <AsyncDropdown<LearningPathSearchSummary | GroupSearchSummary, SelectedType>
              idField="id"
              name="resourceSearch"
              labelField="title"
              placeholder={t('form.content.relatedArticle.placeholder')}
              label="label"
              apiAction={(input: string) => onInputSearch(input, selectedType)}
              onChange={onSelect}
              startOpen
            />
          </React.Fragment>
        )}
        {selected?.id && content?.id && <ArticlePreview article={content} />}
      </StyledContent>
    </TaxonomyLightbox>
  );
};

AddResourceModal.defaultProps = {
  allowPaste: false,
};

export default injectT(AddResourceModal);
