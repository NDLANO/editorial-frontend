/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import * as draftApi from '../../modules/draft/draftApi';
import { transformArticleFromApiVersion } from '../../util/articleUtil';
import { queryResources, queryTopics } from '../../modules/taxonomy';
import { ConvertedDraftType, LocaleType } from '../../interfaces';
import {
  DraftStatusTypes,
  NewDraftApiType,
  UpdatedDraftApiType,
} from '../../modules/draft/draftApiInterfaces';
import { Resource, Topic } from '../../modules/taxonomy/taxonomyApiInterfaces';

export type ArticleTaxonomy = {
  resources: Resource[];
  topics: Topic[];
};

export function useFetchArticleData(articleId: string | undefined, locale: LocaleType) {
  const [article, setArticle] = useState<ConvertedDraftType | undefined>(undefined);
  const [articleChanged, setArticleChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        setLoading(true);
        const article = await draftApi.fetchDraft(parseInt(articleId, 10), locale);
        const taxonomy = await fetchTaxonomy(articleId, locale);
        setArticle(await transformArticleFromApiVersion({ taxonomy, ...article }, locale));
        setArticleChanged(false);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, locale]);

  const fetchTaxonomy = async (id: string, language: LocaleType): Promise<ArticleTaxonomy> => {
    const [resources, topics] = await Promise.all([
      queryResources(id, language, 'article'),
      queryTopics(id, language, 'article'),
    ]);

    return { resources, topics };
  };

  const updateArticle = async (
    updatedArticle: UpdatedDraftApiType,
  ): Promise<ConvertedDraftType> => {
    const savedArticle = await draftApi.updateDraft(updatedArticle);
    const taxonomy = !!articleId ? await fetchTaxonomy(articleId, locale) : undefined;
    const updated = await transformArticleFromApiVersion({ taxonomy, ...savedArticle }, locale);
    await updateUserData(savedArticle.id);
    setArticle(updated);
    setArticleChanged(false);
    return updated;
  };

  const updateArticleAndStatus = async ({
    updatedArticle,
    newStatus,
    dirty,
  }: {
    updatedArticle: UpdatedDraftApiType;
    newStatus: DraftStatusTypes;
    dirty: boolean;
  }): Promise<ConvertedDraftType> => {
    if (dirty) {
      await draftApi.updateDraft(updatedArticle);
    }

    if (!updatedArticle.id) throw new Error('Article without id gotten when updating status');

    const statusChangedDraft = await draftApi.updateStatusDraft(updatedArticle.id, newStatus);
    const updated = await transformArticleFromApiVersion(statusChangedDraft, locale);
    await updateUserData(statusChangedDraft.id);

    setArticle(updated);
    setArticleChanged(false);
    return updated;
  };

  const createArticle = async (createdArticle: NewDraftApiType) => {
    const savedArticle = await draftApi.createDraft(createdArticle);
    setArticle(await transformArticleFromApiVersion(savedArticle, locale));
    setArticleChanged(false);
    await updateUserData(savedArticle.id);
    return savedArticle;
  };

  const updateUserData = async (articleId: number) => {
    const stringId = articleId.toString();
    const result = await draftApi.fetchUserData();
    const latestEditedArticles = Array.from(new Set(result.latestEditedArticles || []));
    let userUpdatedMetadata;

    if (!latestEditedArticles.includes(stringId)) {
      if (latestEditedArticles.length >= 10) {
        latestEditedArticles.pop();
      }
      latestEditedArticles.splice(0, 0, stringId);
      userUpdatedMetadata = {
        latestEditedArticles: latestEditedArticles,
      };
    } else {
      const latestEditedFiltered = latestEditedArticles.filter(id => {
        return id !== stringId;
      });
      latestEditedFiltered.unshift(stringId);
      userUpdatedMetadata = {
        latestEditedArticles: latestEditedFiltered,
      };
    }

    draftApi.updateUserData(userUpdatedMetadata);
  };

  return {
    article,
    setArticle: (article: ConvertedDraftType) => {
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
