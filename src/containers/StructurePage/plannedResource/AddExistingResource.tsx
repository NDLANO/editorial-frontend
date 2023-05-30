/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQueryClient } from '@tanstack/react-query';
import { InputV2 } from '@ndla/forms';
import styled from '@emotion/styled';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ILearningPathSummaryV2 } from '@ndla/types-backend/learningpath-api';
import { IGroupSearchResult, IMultiSearchSummary } from '@ndla/types-backend/search-api';
import { IArticleV2 } from '@ndla/types-backend/article-api';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { RESOURCE_TYPE_LEARNING_PATH, RESOURCE_TYPE_SUBJECT_MATERIAL } from '../../../constants';
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
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { resourcesWithNodeConnectionQueryKey } from '../../../modules/nodes/nodeQueries';
import Spinner from '../../../components/Spinner';
import { ButtonWrapper, StyledLabel, inputWrapperStyles } from './PlannedResourceForm';

const StyledOrDivider = styled.div`
  display: flex;
  justify-content: center;
  padding: ${spacing.small} 0 0;
`;
const ContentWrapper = styled.div`
  padding-left: ${spacing.medium};
`;

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
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
  nodeId: string;
  existingResourceIds: string[];
}

interface Content extends Pick<IMultiSearchSummary, 'id' | 'title' | 'metaDescription'> {
  metaUrl?: string;
  paths?: string[];
}

type ArticleWithPaths = IArticleV2 & { paths: string[] | undefined };

type PossibleResources = ArticleWithPaths | ILearningPathSummaryV2 | IMultiSearchSummary;

const AddExistingResource = ({ onClose, resourceTypes, existingResourceIds, nodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<Content | undefined>(undefined);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(RESOURCE_TYPE_SUBJECT_MATERIAL);
  const [pastedUrl, setPastedUrl] = useState('');
  const qc = useQueryClient();
  const { taxonomyVersion } = useTaxonomyVersion();
  const compKey = resourcesWithNodeConnectionQueryKey({ id: nodeId, language: i18n.language });
  const { mutateAsync: createNodeResource } = usePostResourceForNodeMutation({
    onSuccess: (_) => qc.invalidateQueries(compKey),
  });
  const canPaste = selectedType !== RESOURCE_TYPE_LEARNING_PATH;

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

    await createNodeResource({ body: { resourceId, nodeId }, taxonomyVersion })
      .then((_) => onClose())
      .catch((err) => setError('taxonomy.resource.creationFailed'));
    setLoading(false);
  };

  const findResourceIdLearningPath = async (learningpathId: number) => {
    await updateLearningPathTaxonomy(learningpathId, true);
    try {
      const resource = await queryLearningPathResource({ learningpathId, taxonomyVersion });
      if (resource.length > 0) {
        return resource[0].id;
      } else throw Error(`Could not find resource after updating for ${learningpathId}`);
    } catch (e) {
      const err = e as Error;
      handleError(err);
      setLoading(false);
      setError(err.message);
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
        fetchResource({ id: resourceId, taxonomyVersion }),
        fetchResourceResourceType({ id: resourceId, taxonomyVersion }),
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
    } catch (e) {
      const error = e as Error;
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
    <>
      <ContentWrapper>
        {canPaste && selectedType && (
          <>
            <InputV2
              customCss={inputWrapperStyles}
              label={t('taxonomy.urlPlaceholder')}
              white
              onChange={onPaste}
              name="pasteUrlInput"
              placeholder={t('taxonomy.urlPlaceholder')}
            />
            {canPaste && <StyledOrDivider>{t('taxonomy.or')}</StyledOrDivider>}
          </>
        )}
        <StyledSection>
          <div>
            <StyledLabel htmlFor="select-resource-type">{t('taxonomy.contentType')}</StyledLabel>
            <ResourceTypeSelect
              availableResourceTypes={resourceTypes ?? []}
              onChangeSelectedResource={(value) => {
                if (value) setSelectedType(value?.value);
              }}
              isClearable
            />
          </div>
          {!pastedUrl && selectedType && (
            <>
              <AsyncDropdown<ILearningPathSummaryV2 | IMultiSearchSummary>
                idField="id"
                labelField="title"
                placeholder={t('form.content.relatedArticle.placeholder')}
                apiAction={(query, page) => onSearch(query, page)}
                onChange={(res) => setContent(toContent(res))}
                startOpen={false}
                showPagination
                initialSearch={false}
                label={t('form.content.relatedArticle.placeholder')}
                white
              />
            </>
          )}
        </StyledSection>
        {content && <ArticlePreview article={content} />}
        {error && (
          <AlertModal
            title={t('errorMessage.description')}
            label={t('errorMessage.description')}
            show={!!error}
            text={error}
            onCancel={() => setError('')}
          />
        )}
      </ContentWrapper>
      <ButtonWrapper>
        <ButtonV2 onClick={onAddResource} type="submit">
          {loading ? <Spinner appearance="small" /> : t('taxonomy.get')}
        </ButtonV2>
      </ButtonWrapper>
    </>
  );
};

export default AddExistingResource;
