/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQueryClient } from 'react-query';
import { Input } from '@ndla/forms';
import styled from '@emotion/styled';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ILearningPathSummaryV2 } from '@ndla/types-learningpath-api';
import { IGroupSearchResult, IMultiSearchSummary } from '@ndla/types-search-api';
import { IArticleV2 } from '@ndla/types-article-api';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';
import ResourceTypeSelect from '../../ArticlePage/components/ResourceTypeSelect';
import { getResourceIdFromPath } from '../../../util/routeHelpers';
import {
  fetchResource,
  fetchResourceResourceType,
  queryLearningPathResource,
} from '../../../modules/taxonomy';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import {
  learningpathSearch,
  updateLearningPathTaxonomy,
} from '../../../modules/learningpath/learningpathApi';
import { groupSearch } from '../../../modules/search/searchApi';
import AlertModal from '../../../components/AlertModal';
import ArticlePreview from '../../../components/ArticlePreview';
import { getArticle } from '../../../modules/article/articleApi';
import handleError from '../../../util/handleError';
import { usePostResourceForNodeMutation } from '../../../modules/nodes/nodeMutations';
import { RESOURCES_WITH_NODE_CONNECTION } from '../../../queryKeys';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

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
  type?: string;
  resourceTypes?: {
    id: string;
    name: string;
  }[];
  allowPaste?: boolean;
  nodeId: string;
  existingResourceIds: string[];
}

interface Content extends Pick<IMultiSearchSummary, 'id' | 'title' | 'metaDescription'> {
  metaUrl?: string;
  paths?: string[];
}

type ArticleWithPaths = IArticleV2 & { paths: string[] | undefined };

type PossibleResources = ArticleWithPaths | ILearningPathSummaryV2 | IMultiSearchSummary;

const AddResourceModal = ({
  onClose,
  type,
  allowPaste = false,
  resourceTypes,
  existingResourceIds,
  nodeId,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<Content | undefined>(undefined);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(type);
  const [pastedUrl, setPastedUrl] = useState('');
  const qc = useQueryClient();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: createNodeResource } = usePostResourceForNodeMutation({
    onSuccess: _ => {
      qc.invalidateQueries([RESOURCES_WITH_NODE_CONNECTION, nodeId, { language: i18n.language }]);
    },
  });
  const canPaste = allowPaste || selectedType !== RESOURCE_TYPE_LEARNING_PATH;

  const toContent = (resource: PossibleResources): Content => {
    if ('metaUrl' in resource) {
      const { description, language } = resource.description;
      return { ...resource, metaDescription: { metaDescription: description, language } };
    } else {
      return { ...resource, metaUrl: resource.metaImage?.url };
    }
  };

  const onAddResource = async () => {
    if (!content) return;
    setLoading(true);
    const isLearningpath = selectedType === RESOURCE_TYPE_LEARNING_PATH && 'metaUrl' in content;
    const isArticleOrDraft = 'paths' in content;
    const resourceId = isLearningpath
      ? await findResourceIdLearningPath(content.id)
      : isArticleOrDraft
      ? getResourceIdFromPath(content.paths?.[0])
      : undefined;
    if (!resourceId) {
      setError(t('taxonomy.resource.noResourceId'));
      setLoading(false);
      setContent(undefined);
      return;
    }
    if (existingResourceIds.includes(resourceId)) {
      setError(t('taxonomy.resource.addResourceConflict'));
      setLoading(false);
      setContent(undefined);
      return;
    }

    await createNodeResource({ vars: { body: { resourceId, nodeId } }, taxonomyVersion })
      .then(_ => onClose())
      .catch(err => setError('taxonomy.resource.creationFailed'));
    setLoading(false);
  };

  const findResourceIdLearningPath = async (learningpathId: number) => {
    await updateLearningPathTaxonomy(learningpathId, true);
    try {
      const resource = await queryLearningPathResource(learningpathId);
      if (resource.length > 0) {
        return resource[0].id;
      } else throw Error(`Could not find resource after updating for ${learningpathId}`);
    } catch (e) {
      handleError(e);
      setLoading(false);
      setError(e.message);
    }
  };

  const onPaste = async (evt: ChangeEvent<HTMLInputElement>) => {
    const resourceId = getResourceIdFromPath(evt.target.value);
    setPastedUrl(evt.currentTarget.value);
    if (!evt.target.value) {
      setError(t('errorMessage.invalidUrl'));
      return;
    } else if (!resourceId) {
      setError('');
      return;
    }
    try {
      const [resource, resourceType] = await Promise.all([
        fetchResource(resourceId),
        fetchResourceResourceType(resourceId),
      ]);
      const pastedType = resourceType.length > 0 && resourceType[0].id;
      const typeError =
        pastedType === selectedType ? '' : `${t('taxonomy.wrongType')} ${pastedType}`;
      setError(typeError);
      const id = Number(resource.contentUri?.split(':').pop());
      if (!typeError && id) {
        const article = await getArticle(id);
        setContent(toContent({ ...article, paths: [evt.target.value] }));
      }
    } catch (error) {
      handleError(error);
      setError(error.message);
    }
  };

  const onSearch = async (query: string, page?: number) => {
    const baseQuery = {
      query,
      page,
      language: i18n.language,
      fallback: true,
    };
    if (selectedType === RESOURCE_TYPE_LEARNING_PATH) {
      return await learningpathSearch({ ...baseQuery, verificationStatus: 'CREATED_BY_NDLA' });
    } else {
      const res = await groupSearch({ ...baseQuery, 'resource-types': selectedType });
      return res.pop() ?? emptySearchResults;
    }
  };

  return (
    <TaxonomyLightbox
      title={t('taxonomy.searchResource')}
      onSelect={onAddResource}
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
        {canPaste && selectedType && (
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
            {canPaste && <StyledOrDivider>{t('taxonomy.or')}</StyledOrDivider>}
            <AsyncDropdown<ILearningPathSummaryV2 | IMultiSearchSummary>
              idField="id"
              labelField="title"
              placeholder={t('form.content.relatedArticle.placeholder')}
              apiAction={(query, page) => onSearch(query, page)}
              onChange={res => setContent(toContent(res))}
              startOpen
              showPagination
            />
          </>
        )}
        {content && <ArticlePreview article={content} />}
        {error && (
          <AlertModal
            show={!!error}
            text={error}
            onCancel={() => setError('')}
            severity={'danger'}
          />
        )}
      </StyledContent>
    </TaxonomyLightbox>
  );
};

export default AddResourceModal;
