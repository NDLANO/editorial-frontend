/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { dropRight, uniq } from 'lodash';
import {
  INewArticle as NewDraftApiType,
  IUpdatedArticle as UpdatedDraftApiType,
  IArticle as DraftApiType,
} from '@ndla/types-draft-api';
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

export interface ArticleTaxonomy {
  resources: Resource[];
  topics: Topic[];
}

export function useFetchArticleData(articleId: string | undefined, language: string) {
  const [article, setArticle] = useState<DraftApiType | undefined>(undefined);
  const [taxonomy, setTaxonony] = useState<ArticleTaxonomy>({ resources: [], topics: [] });
  const [articleChanged, setArticleChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        setLoading(true);
        const article = await fetchDraft(parseInt(articleId, 10), language);
        const taxonomy = await fetchTaxonomy(articleId, language);
        setArticle(article);
        setTaxonony(taxonomy);
        setArticleChanged(false);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, language]);

  const fetchTaxonomy = async (id: string, language: string) => {
    const [resources, topics] = await Promise.all([
      queryResources(id, language, 'article'),
      queryTopics(id, language, 'article'),
    ]);
    return { resources, topics };
  };

  const updateArticle = async (updatedArticle: UpdatedDraftApiType): Promise<DraftApiType> => {
    const savedArticle = await updateDraft(Number(articleId), updatedArticle);
    await updateUserData(savedArticle.id);
    setArticle(savedArticle);
    setArticleChanged(false);
    return savedArticle;
  };

  const updateArticleAndStatus = async ({
    updatedArticle,
    newStatus,
    dirty,
  }: {
    updatedArticle: UpdatedDraftApiType;
    newStatus: string;
    dirty: boolean;
  }): Promise<DraftApiType> => {
    if (dirty) {
      await updateDraft(Number(articleId), updatedArticle);
    }

    if (!articleId) throw new Error('Article without id gotten when updating status');

    const statusChangedDraft = await updateStatusDraft(Number(articleId), newStatus);
    const article = await fetchDraft(Number(articleId), language);
    const updated: DraftApiType = { ...article, status: statusChangedDraft.status };
    await updateUserData(statusChangedDraft.id);

    setArticle(updated);
    setArticleChanged(false);
    return updated;
  };

  const createArticle = async (createdArticle: NewDraftApiType) => {
    const savedArticle = await createDraft(createdArticle);
    setArticle(savedArticle);
    setArticleChanged(false);
    await updateUserData(savedArticle.id);
    return savedArticle;
  };

  const updateUserData = async (articleId: number) => {
    const stringId = articleId.toString();
    const result = await fetchUserData();
    const latestEdited = uniq(result.latestEditedArticles || []);
    const latestEditedArticles = latestEdited.includes(stringId)
      ? [stringId].concat(latestEdited.filter(id => id !== stringId))
      : [stringId].concat(dropRight(latestEdited, 1));
    apiUpdateUserData({ latestEditedArticles });
  };

  return {
    article,
    taxonomy,
    setArticle: (article: DraftApiType) => {
      setArticle(article);
      setArticleChanged(true);
    },
    articleChanged,
    updateArticle,
    createArticle,
    updateArticleAndStatus,
    loading,
  };
}
