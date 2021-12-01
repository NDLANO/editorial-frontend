/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@ndla/forms';
import styled from '@emotion/styled';
import { useQueryClient } from 'react-query';
import ResourceTypeSelect from '../../ArticlePage/components/ResourceTypeSelect';
import handleError from '../../../util/handleError';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { groupSearch } from '../../../modules/search/searchApi';
import { fetchResource, queryLearningPathResource } from '../../../modules/taxonomy';
import { getResourceIdFromPath } from '../../../util/routeHelpers';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';
import { getArticle } from '../../../modules/article/articleApi';
import {
  learningpathSearch,
  updateLearningPathTaxonomy,
} from '../../../modules/learningpath/learningpathApi';
import ArticlePreview from '../../../components/ArticlePreview';
import { LearningPathSearchSummary } from '../../../modules/learningpath/learningpathApiInterfaces';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { MultiSearchSummary } from '../../../modules/search/searchApiInterfaces';
import AlertModal from '../../../components/AlertModal';
import { ArticleApiType } from '../../../modules/article/articleApiInterfaces';
import { SearchResultBase } from '../../../interfaces';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { usePostResourceForNodeMutation } from '../../../modules/taxonomy/nodes/nodeMutations';
import { RESOURCES_WITH_NODE_CONNECTION } from '../../../queryKeys';

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

const emptySearchResults: SearchResultBase<any> = {
  totalCount: 0,
  page: 0,
  pageSize: 0,
  language: '',
  results: [],
};

interface Props {
  onClose: () => void;
  resourceTypes?: ResourceType[];
  type?: string;
  allowPaste?: boolean;
  nodeId: string;
  existingResourceIds: string[];
}

interface ContentType {
  id: number;
  title: { title: string; language: string };
  metaDescription: { metaDescription: string; language: string };
  metaUrl?: string;
  paths?: string[];
}

interface BaseSelectedType {
  id?: number;
  paths?: string[];
}

type ResultTypes = LearningPathSearchSummary | MultiSearchSummary | BaseSelectedType;

const AddResourceModal = ({
  onClose,
  type,
  resourceTypes,
  allowPaste = false,
  nodeId,
  existingResourceIds,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [selectedType, setSelectedType] = useState<string | undefined>(type);
  const [selected, setSelected] = useState<ResultTypes | undefined>(undefined);
  const [content, setContent] = useState<ContentType | undefined>(undefined);
  const [pastedUrl, setPastedUrl] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const createNodeResource = usePostResourceForNodeMutation({
    onSettled: _ =>
      qc.invalidateQueries([RESOURCES_WITH_NODE_CONNECTION, nodeId, { language: i18n.language }]),
  });

  const setNoSelection = () => {
    setSelected(undefined);
    setContent(undefined);
  };

  const paste = allowPaste || selectedType !== RESOURCE_TYPE_LEARNING_PATH;

  const onSelect = (selected: ResultTypes) => {
    if ('url' in selected && !selected.url.includes('learningpaths')) {
      const articleId = Number(selected.url.split('/').pop());

      if (isNaN(articleId)) {
        return setNoSelection();
      }
      setContent(articleToContent(selected));
    }
    if ('metaUrl' in selected && selected.metaUrl.includes('learningpaths')) {
      setContent(learningpathToContent(selected));
    }
    setSelected(selected);
  };

  const onPaste = async (evt: ChangeEvent<HTMLInputElement>) => {
    const val = evt.target.value;
    const resourceId = getResourceIdFromPath(val);
    if (!val || !resourceId) {
      setError(!val ? '' : t('errorMessage.invalidUrl'));
      setPastedUrl(val);
      return;
    }
    try {
      const resource = await fetchResource(resourceId);
      if (resource.contentUri) {
        const article = await getArticle(Number(resource.contentUri.split(':').pop()!));
        setContent(articleToContent(article));
      }
      const pastedType = resource.resourceTypes[0].id;
      const isSameType = resource.resourceTypes.some(rt => rt.id === selectedType);
      const error = isSameType ? '' : `${t('taxonomy.wrongType')} ${pastedType}`;
      setSelected({ id: parseInt(val), paths: [val] });
      setPastedUrl(val);
      setError(error);
    } catch (error) {
      handleError(error);
      setError(error.message);
    }
  };

  const onInputSearch = async (input: string, type: string, locale: string, page?: number) => {
    try {
      const func = type === RESOURCE_TYPE_LEARNING_PATH ? searchLearningpath : searchGroups;
      const res = await func(input, type, locale, page);
      return res ?? emptySearchResults;
    } catch (err) {
      handleError(err);
      setError(err.message);
      return emptySearchResults;
    }
  };

  const searchLearningpath = async (input: string, type: string, locale: string, page?: number) => {
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

  const searchGroups = async (query: string, type: string, language: string, page?: number) =>
    groupSearch({ query, page, 'resource-types': type, fallback: true, language }).then(res =>
      res.pop(),
    );

  const articleToContent = (article: MultiSearchSummary | ArticleApiType): ContentType => ({
    id: article.id,
    metaDescription: article.metaDescription,
    title: article.title,
    metaUrl: article.metaImage?.url,
  });

  const learningpathToContent = (learningpath: LearningPathSearchSummary): ContentType => ({
    id: learningpath.id,
    metaDescription: {
      metaDescription: learningpath.description.description,
      language: learningpath.description.language,
    },
    title: learningpath.title,
    metaUrl: learningpath.coverPhotoUrl,
  });

  const addSelected = async () => {
    if (selected?.id === undefined) return;
    try {
      setLoading(true);
      let resourceId: string | undefined;
      if (selectedType === RESOURCE_TYPE_LEARNING_PATH) {
        resourceId = await findResourceIdLearningPath(selected.id);
      } else if ('paths' in selected) {
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
      await createNodeResource.mutateAsync({ body: { resourceId, nodeId } });
      setLoading(false);
      onClose();
    } catch (e) {
      setLoading(false);
      setError(e.messages);
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

  const resourceTypesWithoutSubTypes = resourceTypes?.map(rt => ({ ...rt, subtypes: undefined }));
  return (
    <TaxonomyLightbox
      title={t('taxonomy.searchResource')}
      onSelect={addSelected}
      loading={loading}
      onClose={onClose}>
      <StyledContent>
        {!type && (
          <ResourceTypeSelect
            availableResourceTypes={resourceTypesWithoutSubTypes}
            resourceTypes={selectedType ? [selectedType] : []}
            onChangeSelectedResource={(e: ChangeEvent<HTMLSelectElement>) =>
              setSelectedType(e.target.value)
            }
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
            <AsyncDropdown<LearningPathSearchSummary | MultiSearchSummary>
              idField="id"
              labelField="title"
              placeholder={t('form.content.relatedArticle.placeholder')}
              apiAction={(query, page) => onInputSearch(query, selectedType, i18n.language, page)}
              onChange={onSelect}
              startOpen
              showPagination
            />
          </>
        )}
        {content?.id && <ArticlePreview article={content} />}
        <AlertModal show={!!error} text={error ?? ''} onCancel={() => setError(undefined)} />
      </StyledContent>
    </TaxonomyLightbox>
  );
};

export default AddResourceModal;
