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

type SummaryTypes = LearningPathSearchSummary | GroupSearchSummary;

const AddResourceModal = ({
  onClose,
  type,
  allowPaste,
  topicId,
  refreshResources,
  t,
}: Props & tType) => {
  const [selected, setSelected] = useState<SelectedType | null>(null);
  const [content, setContent] = useState<ContentType | null>(null);
  const [pastedUrl, setPastedUrl] = useState('');
  const [error, setError] = useState<string | undefined | null>(undefined);
  const [loading, setLoading] = useState(false);

  const setNoSelection = () => {
    setSelected(null);
    setContent(null);
  };

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
          articleToState(parseInt(resource.contentUri!.split(':').pop()!));
        }

        const pastedType = resourceType.length > 0 && resourceType[0].id;
        const error = pastedType === type ? '' : `${t('taxonomy.wrongType')} ${pastedType}`;
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

  const onInputSearch = async (input: string): Promise<SummaryTypes[]> => {
    try {
      if (type === RESOURCE_TYPE_LEARNING_PATH) {
        const lps = await searchLearningpath(input);

        return lps.map(lp => ({
          ...lp,
          metaDescription: lp.description.description,
        }));
      } else {
        return await searchGroups(input);
      }
    } catch (err) {
      handleError(err);
      setError(err.message);
      return [];
    }
  };

  const searchLearningpath = async (input: string): Promise<LearningPathSearchSummary[]> => {
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

  const searchGroups = async (input: string) => {
    const res = await groupSearch(input, type);
    return res?.pop()?.results || [];
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
          type === RESOURCE_TYPE_LEARNING_PATH
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
        {allowPaste && (
          <Input
            type="text"
            data-testid="addResourceUrlInput"
            value={pastedUrl}
            onChange={onPaste}
            placeholder={t('taxonomy.urlPlaceholder')}
          />
        )}
        {error && <span className="c-errorMessage">{error}</span>}

        {!pastedUrl && (
          <React.Fragment>
            {allowPaste && <StyledOrDivider>{t('taxonomy.or')}</StyledOrDivider>}
            <AsyncDropdown
              idField="id"
              name="resourceSearch"
              labelField="title"
              placeholder={t('form.content.relatedArticle.placeholder')}
              label="label"
              apiAction={onInputSearch}
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

export default injectT(AddResourceModal);
