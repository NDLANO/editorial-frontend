/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isArray } from 'lodash';
import { Input } from '@ndla/forms';
import styled from '@emotion/styled';
import { ILearningPathSummaryV2, ISearchResultV2 } from '@ndla/types-learningpath-api';
import { IGroupSearchResult, IMultiSearchSummary } from '@ndla/types-search-api';
import { IArticleSummaryV2 } from '@ndla/types-article-api';
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
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { GroupSearchSummary } from '../../../modules/search/searchApiInterfaces';
import AlertModal from '../../../components/AlertModal';

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

const emptySearchResults: IGroupSearchResult = {
  totalCount: 0,
  page: 0,
  pageSize: 0,
  language: '',
  results: [],
  suggestions: [],
  aggregations: [],
  resourceType: '',
};

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

type ContentType = Pick<IArticleSummaryV2, 'title' | 'metaDescription' | 'id'> & {
  metaUrl?: string;
  paths?: string[];
};

interface BaseSelectedType {
  id?: number;
  paths?: string[];
}

type ResultTypes = ISearchResultV2 | IGroupSearchResult | BaseSelectedType;

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
  const [selected, setSelected] = useState<ResultTypes | null>(null);
  const [content, setContent] = useState<ContentType | null>(null);
  const [pastedUrl, setPastedUrl] = useState('');
  const [error, setError] = useState<string | undefined | null>(undefined);
  const [loading, setLoading] = useState(false);

  const setNoSelection = () => {
    setSelected(null);
    setContent(null);
  };

  const paste = allowPaste || selectedType !== RESOURCE_TYPE_LEARNING_PATH;

  const isLearningPathSearchSummary = (obj: any): obj is ILearningPathSummaryV2 => {
    return obj.metaUrl !== undefined;
  };

  const hasPathsProp = (obj: any): obj is { paths?: string[] } => isArray(obj.paths);

  const isGroupSearchSummary = (obj: any): obj is GroupSearchSummary => {
    return obj.url !== undefined;
  };

  const hasId = (obj: any): obj is { id: number | string } => {
    return obj && typeof obj.id !== undefined;
  };

  const onSelect = (selected: ResultTypes) => {
    if (isGroupSearchSummary(selected)) {
      if (selected.url && !selected.url.includes('learningpaths')) {
        const articleId = Number(selected.url.split('/')?.pop());

        if (isNaN(articleId)) {
          return setNoSelection();
        }

        articleToState(Number(articleId));
      }
    }
    if (isLearningPathSearchSummary(selected)) {
      if (selected.metaUrl && selected.metaUrl.includes('learningpaths')) {
        learningpathToState(selected);
      }
    }
    setSelected(selected);
  };

  const onPaste = async (evt: ChangeEvent<HTMLInputElement>) => {
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
        setSelected({ id: parseInt(val), paths: [val] });
        setPastedUrl(val);
        setError(error);
      } catch (error) {
        handleError(error);
        //@ts-ignore
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
    locale: string,
    page?: number,
  ): Promise<ISearchResultV2 | IGroupSearchResult> => {
    try {
      if (type === RESOURCE_TYPE_LEARNING_PATH) {
        return searchLearningpath(input, type, locale, page);
      } else {
        const searchResult = await searchGroups(input, type, locale, page);
        return searchResult ?? emptySearchResults;
      }
    } catch (err) {
      handleError(err);
      setError(err.message);
      return emptySearchResults;
    }
  };

  const searchLearningpath = async (
    input: string,
    type: string,
    locale: string,
    page?: number,
  ): Promise<ISearchResultV2> => {
    const query = {
      query: input,
      pageSize: 10,
      language: locale,
      page,
      type,
      fallback: true,
      verificationStatus: 'CREATED_BY_NDLA',
    };
    return await learningpathSearch(query);
  };

  const searchGroups = async (query: string, type: string, locale: string, page?: number) => {
    const res = await groupSearch({
      query,
      page,
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

  const learningpathToState = ({
    id,
    description,
    title,
    coverPhotoUrl,
  }: ILearningPathSummaryV2) => {
    setContent({
      id,
      metaDescription: {
        ...description,
        metaDescription: description.description,
      },
      title,
      metaUrl: coverPhotoUrl,
    });
  };

  const addSelected = async () => {
    if (hasId(selected)) {
      try {
        setLoading(true);

        let resourceId: string | undefined;
        if (selectedType === RESOURCE_TYPE_LEARNING_PATH && isLearningPathSearchSummary(selected)) {
          resourceId = await findResourceIdLearningPath(Number(selected.id));
        } else if (hasPathsProp(selected)) {
          resourceId = getResourceIdFromPath(selected?.paths?.[0]);
        }

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
        //@ts-ignore
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
      //@ts-ignore
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
            availableResourceTypes={resourceTypes ?? []}
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
            <AsyncDropdown<ILearningPathSummaryV2 | IMultiSearchSummary>
              idField="id"
              labelField="title"
              placeholder={t('form.content.relatedArticle.placeholder')}
              apiAction={(query, page) => onInputSearch(query, selectedType, locale, page)}
              onChange={onSelect}
              startOpen
              showPagination
            />
          </>
        )}
        {hasId(selected) && content?.id && <ArticlePreview article={content} />}
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
