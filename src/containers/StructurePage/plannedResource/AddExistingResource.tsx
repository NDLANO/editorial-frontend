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
import { ILearningPathSummaryV2, ILearningPathV2 } from '@ndla/types-backend/learningpath-api';
import {
  IGroupSearchResult,
  IMultiSearchResult,
  IMultiSearchSummary,
} from '@ndla/types-backend/search-api';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { IArticleV2 } from '@ndla/types-backend/article-api';
import { getResourceIdFromPath } from '../../../util/routeHelpers';
import { RESOURCE_TYPE_LEARNING_PATH, RESOURCE_TYPE_SUBJECT_MATERIAL } from '../../../constants';
import ResourceTypeSelect from '../../ArticlePage/components/ResourceTypeSelect';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import {
  learningpathSearch,
  updateLearningPathTaxonomy,
} from '../../../modules/learningpath/learningpathApi';
import { groupSearch } from '../../../modules/search/searchApi';
import ArticlePreview from '../../../components/ArticlePreview';
import { getArticle } from '../../../modules/article/articleApi';
import handleError from '../../../util/handleError';
import { usePostResourceForNodeMutation } from '../../../modules/nodes/nodeMutations';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { resourcesWithNodeConnectionQueryKey } from '../../../modules/nodes/nodeQueries';
import Spinner from '../../../components/Spinner';
import {
  ButtonWrapper,
  ErrorMessage,
  StyledLabel,
  inputWrapperStyles,
} from './PlannedResourceForm';
import { resolveUrls } from '../../../modules/taxonomy/taxonomyApi';
import {
  apiResourceUrl,
  fetchAuthorized,
  resolveJsonOrRejectWithError,
} from '../../../util/apiHelpers';
import { queryLearningPathResource } from '../../../modules/taxonomy';

const StyledOrDivider = styled.div`
  display: flex;
  justify-content: center;
  padding: ${spacing.small} 0 0;
`;
const PreviewWrapper = styled.div`
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

interface Preview extends Pick<IMultiSearchSummary, 'id' | 'title' | 'metaDescription'> {
  metaUrl?: string;
  paths?: string[];
}

type PossibleResources =
  | IMultiSearchSummary
  | ILearningPathSummaryV2
  | ILearningPathV2
  | IArticleV2;

const AddExistingResource = ({ onClose, resourceTypes, existingResourceIds, nodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const [preview, setPreview] = useState<Preview | undefined>(undefined);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(RESOURCE_TYPE_SUBJECT_MATERIAL);
  const [pastedUrl, setPastedUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const qc = useQueryClient();
  const { taxonomyVersion } = useTaxonomyVersion();
  const compKey = resourcesWithNodeConnectionQueryKey({ id: nodeId, language: i18n.language });
  const { mutateAsync: createNodeResource } = usePostResourceForNodeMutation({
    onSuccess: (_) => qc.invalidateQueries(compKey),
  });
  const [resourceId, setResourceId] = useState<string | undefined>(undefined);

  const toPreview = (resource: PossibleResources): Preview => {
    if ('metaUrl' in resource) {
      const { description, language } = resource.description;
      const url =
        'coverPhoto' in resource
          ? resource.coverPhoto?.url
          : 'coverPhotoUrl' in resource
          ? resource.coverPhotoUrl
          : undefined;
      return {
        ...resource,
        metaUrl: url,
        metaDescription: { metaDescription: description, language },
      };
    } else {
      return { ...resource, metaUrl: resource.metaImage?.url };
    }
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

  const onAddResource = async () => {
    if (!preview) {
      setError(t('errorMessage.invalidUrl'));
      return;
    }

    let id = resourceId;

    if (!resourceId) {
      const isLearningpath = selectedType === RESOURCE_TYPE_LEARNING_PATH && 'metaUrl' in preview;
      const isArticleOrDraft = 'paths' in preview;
      id = isLearningpath
        ? await findResourceIdLearningPath(preview.id)
        : isArticleOrDraft
        ? getResourceIdFromPath(preview.paths?.[0])
        : undefined;
    }

    if (existingResourceIds.includes(String(resourceId))) {
      resetPastedUrlStatesWithError(t('taxonomy.resource.addResourceConflict'));
      return;
    }

    if (!id) return;

    await createNodeResource({ body: { resourceId: id, nodeId }, taxonomyVersion })
      .then((_) => onClose())
      .catch(() => resetPastedUrlStatesWithError('taxonomy.resource.creationFailed'));
    setLoading(false);
  };

  const resetPastedUrlStatesWithError = (error?: string) => {
    error && setError(error);
    setPreview(undefined);
    setPreviewLoading(false);
    setResourceId(undefined);
  };

  const onPaste = async (evt: ChangeEvent<HTMLInputElement>) => {
    resetPastedUrlStatesWithError('');
    const input = evt.target.value;
    setPastedUrl(input);
    if (!input) return;

    const pastedIsNumber = /^-?\d+$/.test(input);
    const articleIdInPathMatch = input.match(/article\/(\d+)/);
    const articleIdInInput = articleIdInPathMatch
      ? articleIdInPathMatch[1]
      : pastedIsNumber && input;

    let resourceId = undefined;
    let preview = undefined;
    setPreviewLoading(true);

    try {
      if (articleIdInInput) {
        const article = await getArticle(Number(articleIdInInput));
        const baseUrl = apiResourceUrl('/search-api/v1/search/');
        const res = await fetchAuthorized(
          `${baseUrl}?context-types=standard&ids=${article.id}`,
        ).then((r: any) => resolveJsonOrRejectWithError<IMultiSearchResult>(r));

        if (res.results.length) {
          preview = res.results[0];
          resourceId = preview.contexts[0].id;
        } else {
          resetPastedUrlStatesWithError();
          return;
        }
      } else {
        const inputMatch = input.match(/ndla.no\/(.+)/);
        const inputPath = inputMatch && inputMatch[1];

        if (!inputPath) {
          resetPastedUrlStatesWithError(t('errorMessage.invalidUrl'));
          return;
        }

        const resolvedUrl = await resolveUrls({ path: inputPath, taxonomyVersion });
        resourceId = resolvedUrl.id;
        const previewUri = resolvedUrl.contentUri;

        if (previewUri.includes('learningpath')) {
          const learningpathId = resolvedUrl.contentUri.split('learningpath:')[1];
          const learningPathUrl = apiResourceUrl('/learningpath-api/v2/learningpaths/');
          preview = await fetchAuthorized(`${learningPathUrl}/${learningpathId}`, {
            method: 'GET',
          }).then((r: any) => resolveJsonOrRejectWithError<ILearningPathV2>(r));
        } else {
          const previewId = resolvedUrl.contentUri.split('article:')[1];
          preview = await getArticle(Number(previewId));
        }
      }

      if (!preview || !resourceId) {
        return;
      }

      setPreview(toPreview(preview));
      setPreviewLoading(false);
      setResourceId(resourceId);
      setError('');
    } catch (e) {
      resetPastedUrlStatesWithError(t('taxonomy.noResources'));
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
      <PreviewWrapper>
        {selectedType && (
          <>
            <InputV2
              customCss={inputWrapperStyles}
              label={t('taxonomy.urlPlaceholder')}
              white
              onChange={onPaste}
              name="pasteUrlInput"
              placeholder={t('taxonomy.urlPlaceholder')}
            />
            {!pastedUrl && <StyledOrDivider>{t('taxonomy.or')}</StyledOrDivider>}
          </>
        )}
        <StyledSection>
          {!pastedUrl && (
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
          )}
          {!pastedUrl && selectedType && (
            <>
              <AsyncDropdown<ILearningPathSummaryV2 | IMultiSearchSummary>
                idField="id"
                labelField="title"
                placeholder={t('form.content.relatedArticle.placeholder')}
                apiAction={(query, page) => onSearch(query, page)}
                onChange={(res) => setPreview(toPreview(res))}
                startOpen={false}
                showPagination
                initialSearch={false}
                label={t('form.content.relatedArticle.placeholder')}
                white
              />
            </>
          )}
        </StyledSection>
        {previewLoading ? <Spinner /> : preview && <ArticlePreview article={preview} />}
        {error && <ErrorMessage>{t(error)}</ErrorMessage>}
      </PreviewWrapper>
      <ButtonWrapper>
        <ButtonV2 onClick={onAddResource} type="submit">
          {t('taxonomy.get')} {loading && <Spinner appearance="small" />}
        </ButtonV2>
      </ButtonWrapper>
    </>
  );
};

export default AddExistingResource;
