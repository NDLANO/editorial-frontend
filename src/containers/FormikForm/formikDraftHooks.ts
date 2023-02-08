/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useCallback } from 'react';
import dropRight from 'lodash/dropRight';
import uniq from 'lodash/uniq';
import { INewArticle, IUpdatedArticle, IArticle } from '@ndla/types-draft-api';
import {
  fetchDraft,
  updateDraft,
  updateStatusDraft,
  createDraft,
  fetchUserData,
  updateUserData as apiUpdateUserData,
} from '../../modules/draft/draftApi';
import { queryResources, queryTopics } from '../../modules/taxonomy';
import { Resource, Topic } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { DraftStatusType } from '../../interfaces';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

export interface ArticleTaxonomy {
  resources: Resource[];
  topics: Topic[];
}

export function useFetchArticleData(articleId: number | undefined, language: string) {
  const [article, _setArticle] = useState<IArticle | undefined>(undefined);
  const [taxonomy, setTaxonony] = useState<ArticleTaxonomy>({ resources: [], topics: [] });
  const [articleChanged, setArticleChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const { taxonomyVersion } = useTaxonomyVersion();

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        setLoading(true);
        const article = await fetchDraft(articleId, language);
        const [resources, topics] = await Promise.all([
          queryResources({
            contentId: articleId,
            language,
            contentType: 'article',
            taxonomyVersion,
          }),
          queryTopics({ contentId: articleId, language, contentType: 'article', taxonomyVersion }),
        ]);
        _setArticle(article);
        setTaxonony({ resources, topics });
        setArticleChanged(false);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, language, taxonomyVersion]);

  const rightDelete = (ids: string[]): string[] => (ids.length > 10 ? dropRight(ids, 1) : ids);

  const updateUserData = useCallback(async (articleId: number) => {
    const stringId = articleId.toString();
    const result = await fetchUserData();
    const latestEdited = uniq(result.latestEditedArticles || []);
    const latestEditedArticles = latestEdited.includes(stringId)
      ? [stringId].concat(latestEdited.filter(id => id !== stringId))
      : [stringId].concat(rightDelete(latestEdited));

    apiUpdateUserData({ latestEditedArticles });
  }, []);

  const updateArticle = useCallback(
    async (updatedArticle: IUpdatedArticle): Promise<IArticle> => {
      if (!articleId) throw new Error('Received article without id when updating');
      const savedArticle = await updateDraft(articleId, updatedArticle);
      await updateUserData(savedArticle.id);
      _setArticle(savedArticle);
      setArticleChanged(false);
      return savedArticle;
    },
    [articleId, updateUserData],
  );

  const updateArticleAndStatus = useCallback(
    async ({
      updatedArticle,
      newStatus,
      dirty,
    }: {
      updatedArticle: IUpdatedArticle;
      newStatus: DraftStatusType;
      dirty: boolean;
    }): Promise<IArticle> => {
      if (!articleId) throw new Error('Received Article without id when updating status');
      if (dirty) {
        await updateDraft(articleId, updatedArticle);
      }

      const statusChangedDraft = await updateStatusDraft(articleId, newStatus);
      const article = await fetchDraft(articleId, language);
      const updated: IArticle = { ...article, status: statusChangedDraft.status };
      await updateUserData(statusChangedDraft.id);

      _setArticle(updated);
      setArticleChanged(false);
      return updated;
    },
    [articleId, language, updateUserData],
  );

  const createArticle = useCallback(
    async (createdArticle: INewArticle) => {
      const savedArticle = await createDraft(createdArticle);
      _setArticle(savedArticle);
      setArticleChanged(false);
      await updateUserData(savedArticle.id);
      return savedArticle;
    },
    [updateUserData],
  );

  const setArticle = useCallback((article: IArticle) => {
    _setArticle(article);
    setArticleChanged(true);
  }, []);

  return {
    article,
    taxonomy,
    setArticle,
    articleChanged,
    updateArticle,
    createArticle,
    updateArticleAndStatus,
    loading,
  };
}
