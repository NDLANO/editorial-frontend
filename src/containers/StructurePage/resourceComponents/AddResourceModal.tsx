/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@ndla/forms';
import styled from '@emotion/styled';
import ResourceTypeSelect from '../../ArticlePage/components/ResourceTypeSelect';
import handleError from '../../../util/handleError';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { AsyncDropdown } from '../../../components/Dropdown';
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
import { LearningPathSearchResult } from '../../../modules/learningpath/learningpathApiInterfaces';
import {
  GroupSearchResult,
  MultiSearchApiQuery,
} from '../../../modules/search/searchApiInterfaces';
import AlertModal from '../../../components/AlertModal';
import { ArticleSearchSummaryApiType } from '../../../modules/article/articleApiInterfaces';

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
  resourceTypes?: {
    id: string;
    name: string;
  }[];
  type?: string;
  allowPaste?: boolean;
  topicId: string;
  refreshResources: () => void;
  existingResourceIds: string[];
  locale: string;
}

type ContentType = Pick<ArticleSearchSummaryApiType, 'title' | 'metaDescription' | 'id'> & {
  metaUrl?: string;
  paths?: string[];
};

interface SelectedType {
  id: string;
  paths?: string[];
  title?: string;
  url?: string;
  metaUrl?: string;
  description?: string;
  coverPhotoUrl?: string;
}

type ResultTypes = LearningPathSearchResult | GroupSearchResult;

const AddResourceModal = ({
  onClose,
  type,
  resourceTypes,
  allowPaste = false,
  topicId,
  refreshResources,
  existingResourceIds,
  locale,
}: Props) => {
  const { t } = useTranslation();
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

  const onSelect = (selected: SelectedType) => {
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
    query: MultiSearchApiQuery,
    type: string,
    locale: string,
  ): Promise<ResultTypes | undefined> => {
    try {
      if (type === RESOURCE_TYPE_LEARNING_PATH) {
        const lps = await searchLearningpath({ ...query, language: locale });

        return {
          ...lps,
          results: lps?.results.map(lp => ({
            ...lp,
            metaDescription: lp.description.description,
          })),
        };
      } else {
        return await searchGroups(query, type, locale);
      }
    } catch (err) {
      handleError(err);
      setError(err.message);
      return undefined;
    }
  };

  const searchLearningpath = async (
    query: MultiSearchApiQuery,
  ): Promise<LearningPathSearchResult> => {
    const searchBody = {
      ...query,
      pageSize: 10,
      fallback: true,
      verificationStatus: 'CREATED_BY_NDLA',
    };
    return learningpathSearch(searchBody);
  };

  const searchGroups = async (query: MultiSearchApiQuery, type: string, locale: string) => {
    const res = await groupSearch({
      ...query,
      'resource-types': type,
      fallback: true,
      language: locale,
    });
    return res?.pop();
  };

  const articleToState = async (articleId: number) => {
    const article = await getArticle(articleId);
    setContent({
      id: article.id,
      metaDescription: article.metaDescription,
      title: article.title,
      metaUrl: article.metaImage?.url,
    });
  };

  const learningpathToState = (learningpath: SelectedType) => {
    setContent({
      id: parseInt(learningpath.id),
      // We do not know the language of the description or the title. Thus, they should not be used
      // further down the component tree. They are only present to appease TypeScript.
      metaDescription: {
        metaDescription: learningpath.description ?? '',
        language: 'unknown',
      },
      title: { title: learningpath.title ?? '', language: 'unknown' },
      metaUrl: learningpath.coverPhotoUrl,
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

        if (existingResourceIds.includes(resourceId)) {
          setError(t('taxonomy.resource.addResourceConflict'));
          setLoading(false);
          setNoSelection();
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
        setError(e.messages);
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

        {!pastedUrl && selectedType && (
          <>
            {paste && <StyledOrDivider>{t('taxonomy.or')}</StyledOrDivider>}
            <AsyncDropdown
              idField="id"
              name="resourceSearch"
              labelField="title"
              placeholder={t('form.content.relatedArticle.placeholder')}
              label="label"
              apiAction={(query: MultiSearchApiQuery) => onInputSearch(query, selectedType, locale)}
              onChange={onSelect}
              startOpen
              showPagination
            />
          </>
        )}
        {selected?.id && content?.id && <ArticlePreview article={content} />}
        {error && (
          <AlertModal
            show={!!error}
            text={error}
            onCancel={() => {
              setError(null);
            }}
            severity={'danger'}
          />
        )}
      </StyledContent>
    </TaxonomyLightbox>
  );
};

export default AddResourceModal;
