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
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IArticleV2 } from '@ndla/types-backend/article-api';
import { ILearningPathSummaryV2, ILearningPathV2 } from '@ndla/types-backend/learningpath-api';
import { IGroupSearchResult, IMultiSearchSummary } from '@ndla/types-backend/search-api';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { getResourceIdFromPath } from '../../../util/routeHelpers';
import { RESOURCE_TYPE_LEARNING_PATH, RESOURCE_TYPE_SUBJECT_MATERIAL } from '../../../constants';
import ResourceTypeSelect from '../../ArticlePage/components/ResourceTypeSelect';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import {
  fetchLearningpaths,
  learningpathSearch,
  updateLearningPathTaxonomy,
} from '../../../modules/learningpath/learningpathApi';
import { search } from '../../../modules/search/searchApi';
import ArticlePreview from '../../../components/ArticlePreview';
import { getArticle } from '../../../modules/article/articleApi';
import handleError from '../../../util/handleError';
import { usePostResourceForNodeMutation } from '../../../modules/nodes/nodeMutations';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { nodeQueryKeys, useNodes } from '../../../modules/nodes/nodeQueries';
import Spinner from '../../../components/Spinner';
import {
  ButtonWrapper,
  ErrorMessage,
  StyledLabel,
  inputWrapperStyles,
} from './PlannedResourceForm';
import { resolveUrls } from '../../../modules/taxonomy/taxonomyApi';
import { fetchNodes } from '../../../modules/nodes/nodeApi';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(RESOURCE_TYPE_SUBJECT_MATERIAL);
  const [pastedUrl, setPastedUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [contentUri, setContentUri] = useState<string | undefined>();
  const [resourceId, setResourceId] = useState<string | undefined>();
  const [preview, setPreview] = useState<Preview | undefined>(undefined);
  const [articleInputId, setArticleInputId] = useState<string | undefined>();
  const qc = useQueryClient();
  const { taxonomyVersion } = useTaxonomyVersion();
  const compKey = nodeQueryKeys.resources({ id: nodeId, language: i18n.language });
  const { mutateAsync: createNodeResource } = usePostResourceForNodeMutation({
    onSuccess: (_) => qc.invalidateQueries({ queryKey: compKey }),
  });
  const { data: articleSearchData } = useNodes({
    contentURI: `urn:article:${articleInputId}`,
    nodeType: 'RESOURCE',
    taxonomyVersion,
  });

  useEffect(() => {
    if (articleSearchData && articleSearchData.length) {
      const res = articleSearchData[0];
      setResourceId(res.id);
      setContentUri(res.contentUri);
    }
  }, [articleSearchData]);

  useEffect(() => {
    if (!contentUri || !resourceId) return;
    setPreviewLoading(true);
    const fetchData = async () => {
      setPreviewLoading(true);
      let preview = undefined;
      if (contentUri.includes('learningpath')) {
        const learningpathId = contentUri.split('learningpath:')[1];
        const res = await fetchLearningpaths([Number(learningpathId)]);
        preview = res.length && toPreview(res[0]);
      } else {
        const previewId = contentUri.split('article:')[1];
        const res = await getArticle(Number(previewId));
        preview = res && toPreview(res);
      }
      if (preview) {
        setPreview(preview);
      }
    };
    fetchData();
    setPreviewLoading(false);
  }, [contentUri, resourceId]);

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
      const res = await search({ ...baseQuery, 'resource-types': selectedType });
      return res ?? emptySearchResults;
    }
  };

  const resetPastedUrlStatesWithError = (error?: string) => {
    setError(error ?? '');
    setArticleInputId(undefined);
    setPreview(undefined);
    setPreviewLoading(false);
    setResourceId(undefined);
  };

  const onPaste = async (evt: ChangeEvent<HTMLInputElement>) => {
    const input = evt.target.value;
    setPastedUrl(input);

    if (!input) return;

    const pastedIsNumber = /^-?\d+$/.test(input);
    const articleIdInPathMatch = input.match(/article\/(\d+)/);
    const articleIdInInput = articleIdInPathMatch
      ? articleIdInPathMatch[1]
      : pastedIsNumber && input;

    if (articleIdInInput === articleInputId) return;
    resetPastedUrlStatesWithError();

    if (articleIdInInput) {
      setArticleInputId(articleIdInInput);
    } else {
      const inputMatch = input.match(/ndla.no\/(.+)/);
      const inputPath = inputMatch && inputMatch[1];
      if (!inputPath) {
        resetPastedUrlStatesWithError(t('errorMessage.invalidUrl'));
        return;
      }
      try {
        const resolvedUrl = await resolveUrls({ path: inputPath, taxonomyVersion });
        setResourceId(resolvedUrl.id);
        setContentUri(resolvedUrl.contentUri);
      } catch (e) {
        resetPastedUrlStatesWithError(t('taxonomy.noResources'));
      }
    }
  };

  const findResourceIdLearningPath = async (learningpathId: number) => {
    await updateLearningPathTaxonomy(learningpathId, true);
    try {
      const resource = await fetchNodes({
        contentURI: `urn:learningpath:${learningpathId}`,
        taxonomyVersion,
      });
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
    if (!preview) return;
    let id = resourceId;
    if (!id) {
      const isLearningpath = selectedType === RESOURCE_TYPE_LEARNING_PATH && 'metaUrl' in preview;
      const isArticleOrDraft = 'paths' in preview;
      id = isLearningpath
        ? await findResourceIdLearningPath(preview.id)
        : isArticleOrDraft
        ? getResourceIdFromPath(preview.paths?.[0])
        : undefined;
    }

    if (!id) {
      return;
    }

    if (existingResourceIds.includes(String(resourceId))) {
      resetPastedUrlStatesWithError(t('taxonomy.resource.addResourceConflict'));
      return;
    }

    await createNodeResource({ body: { resourceId: id, nodeId }, taxonomyVersion })
      .then((_) => onClose())
      .catch(() => resetPastedUrlStatesWithError('taxonomy.resource.creationFailed'));
    setLoading(false);
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
        <ButtonV2 disabled={preview === undefined} onClick={onAddResource} type="submit">
          {t('taxonomy.add')} {loading && <Spinner appearance="small" />}
        </ButtonV2>
      </ButtonWrapper>
    </>
  );
};

export default AddExistingResource;
