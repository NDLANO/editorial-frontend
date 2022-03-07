/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { dropRight, uniq } from 'lodash';
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

export interface ArticleTaxonomy {
  resources: Resource[];
  topics: Topic[];
}

export function useFetchArticleData(articleId: number | undefined, language: string) {
  const [article, setArticle] = useState<IArticle | undefined>(undefined);
  const [taxonomy, setTaxonony] = useState<ArticleTaxonomy>({ resources: [], topics: [] });
  const [articleChanged, setArticleChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        setLoading(true);
        const article = await fetchDraft(articleId, language);
        const taxonomy = await fetchTaxonomy(articleId, language);
        setArticle(article);
        setTaxonony(taxonomy);
        setArticleChanged(false);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, language]);

  const fetchTaxonomy = async (id: number, language: string) => {
    const [resources, topics] = await Promise.all([
      queryResources(id, language, 'article'),
      queryTopics(id, language, 'article'),
    ]);
    return { resources, topics };
  };

  const updateArticle = async (updatedArticle: IUpdatedArticle): Promise<IArticle> => {
    if (!articleId) throw new Error('Article without id gotten when updating status');
    const savedArticle = await updateDraft(articleId, updatedArticle);
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
    updatedArticle: IUpdatedArticle;
    newStatus: string;
    dirty: boolean;
  }): Promise<IArticle> => {
    if (!articleId) throw new Error('Article without id gotten when updating status');
    if (dirty) {
      await updateDraft(articleId, updatedArticle);
    }

    const statusChangedDraft = await updateStatusDraft(articleId, newStatus);
    const article = await fetchDraft(articleId, language);
    const updated: IArticle = { ...article, status: statusChangedDraft.status };
    await updateUserData(statusChangedDraft.id);

    setArticle(updated);
    setArticleChanged(false);
    return updated;
  };

  const createArticle = async (createdArticle: INewArticle) => {
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
    setArticle: (article: IArticle) => {
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
