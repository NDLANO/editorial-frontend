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
import { DraftStatusType } from '../../interfaces';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

export interface ArticleTaxonomy {
  resources: Resource[];
  topics: Topic[];
}

export function useFetchArticleData(articleId: number | undefined, language: string) {
  const [article, setArticle] = useState<IArticle | undefined>(undefined);
  const [taxonomy, setTaxonony] = useState<ArticleTaxonomy>({ resources: [], topics: [] });
  const [articleChanged, setArticleChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const { taxonomyVersion } = useTaxonomyVersion();

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        setLoading(true);
        const article = await fetchDraft(articleId, language);
        const taxonomy = await fetchTaxonomy(articleId, language, taxonomyVersion);
        setArticle(article);
        setTaxonony(taxonomy);
        setArticleChanged(false);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, language, taxonomyVersion]);

  const fetchTaxonomy = async (id: number, language: string, taxonomyVersion: string) => {
    const [resources, topics] = await Promise.all([
      queryResources({ contentId: id, language, contentType: 'article', taxonomyVersion }),
      queryTopics({ contentId: id, language, contentType: 'article', taxonomyVersion }),
    ]);
    return { resources, topics };
  };

  const updateArticle = async (updatedArticle: IUpdatedArticle): Promise<IArticle> => {
    if (!articleId) throw new Error('Received article without id when updating');
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
