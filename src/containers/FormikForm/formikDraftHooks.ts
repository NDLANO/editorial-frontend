/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { dropRight, uniq } from 'lodash';
import * as draftApi from '../../modules/draft/draftApi';
import {
  DraftApiType,
  DraftStatusTypes,
  NewDraftApiType,
  UpdatedDraftApiType,
} from '../../modules/draft/draftApiInterfaces';

export function useFetchArticleData(articleId: string | undefined, language: string) {
  const [article, setArticle] = useState<DraftApiType | undefined>(undefined);
  const [articleChanged, setArticleChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        setLoading(true);
        const article = await draftApi.fetchDraft(parseInt(articleId, 10), language);
        setArticle(article);
        setArticleChanged(false);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, language]);

  const updateArticle = async (updatedArticle: UpdatedDraftApiType): Promise<DraftApiType> => {
    const savedArticle = await draftApi.updateDraft(updatedArticle);
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
    newStatus: DraftStatusTypes;
    dirty: boolean;
  }): Promise<DraftApiType> => {
    if (dirty) {
      await draftApi.updateDraft(updatedArticle);
    }

    if (!updatedArticle.id) throw new Error('Article without id gotten when updating status');

    const statusChangedDraft = await draftApi.updateStatusDraft(updatedArticle.id, newStatus);
    const article = await draftApi.fetchDraft(updatedArticle.id, language);
    const updated: DraftApiType = { ...article, status: statusChangedDraft.status };
    await updateUserData(statusChangedDraft.id);

    setArticle(updated);
    setArticleChanged(false);
    return updated;
  };

  const createArticle = async (createdArticle: NewDraftApiType) => {
    const savedArticle = await draftApi.createDraft(createdArticle);
    setArticle(savedArticle);
    setArticleChanged(false);
    await updateUserData(savedArticle.id);
    return savedArticle;
  };

  const updateUserData = async (articleId: number) => {
    const stringId = articleId.toString();
    const result = await draftApi.fetchUserData();
    const latestEdited = uniq(result.latestEditedArticles || []);
    const latestEditedArticles = latestEdited.includes(stringId)
      ? [stringId].concat(latestEdited.filter(id => id !== stringId))
      : [stringId].concat(dropRight(latestEdited, 1));
    draftApi.updateUserData({ latestEditedArticles });
  };

  return {
    article,
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
