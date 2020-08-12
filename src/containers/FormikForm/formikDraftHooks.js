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
import { queryResources, queryTopics } from '../../modules/taxonomy/resources';

export function useFetchArticleData(articleId, locale) {
  const [article, setArticle] = useState(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [articleId, locale]);

  const fetchTaxonomy = async (id, language) => {
    const [resources, topics] = await Promise.all([
      queryResources(id, language, 'article'),
      queryTopics(id, language, 'article'),
    ]);

    return { resources, topics };
  };

  const fetchArticle = async () => {
    if (articleId) {
      setLoading(true);
      const article = await draftApi.fetchDraft(articleId, locale);
      const taxonomy = await fetchTaxonomy(articleId, locale);
      setArticle(
        transformArticleFromApiVersion({ taxonomy, ...article }, locale),
      );
      setLoading(false);
    }
  };

  const updateArticle = async updatedArticle => {
    const savedArticle = await draftApi.updateDraft(updatedArticle);
    const taxonomy = await fetchTaxonomy(articleId, locale);
    const updated = transformArticleFromApiVersion(
      { taxonomy, ...savedArticle },
      locale,
    );
    updateUserData(articleId);
    setArticle(updated);
    return updated;
  };

  const updateArticleAndStatus = async ({
    updatedArticle,
    newStatus,
    dirty,
  }) => {
    let newArticle = updatedArticle;
    if (dirty) {
      const savedArticle = await draftApi.updateDraft(updatedArticle);
      newArticle = transformArticleFromApiVersion(savedArticle, locale);
    }
    const statusChangedDraft = await draftApi.updateStatusDraft(
      updatedArticle.id,
      newStatus,
    );
    const updated = {
      ...newArticle,
      notes: statusChangedDraft.notes,
      status: statusChangedDraft.status,
      revision: statusChangedDraft.revision,
    };
    setArticle(updated);
    return updated;
  };

  const createArticle = async createdArticle => {
    const savedArticle = await draftApi.createDraft(createdArticle);
    setArticle(transformArticleFromApiVersion(savedArticle, locale));
    updateUserData(savedArticle.id);
    return savedArticle;
  };

  const updateUserData = async articleId => {
    const result = await draftApi.fetchUserData();
    const latestEditedArticles = result.latestEditedArticles || [];
    let userUpdatedMetadata;

    if (!latestEditedArticles.includes(articleId)) {
      if (latestEditedArticles.length >= 10) {
        latestEditedArticles.pop();
      }
      latestEditedArticles.splice(0, 0, articleId);
      userUpdatedMetadata = {
        latestEditedArticles: latestEditedArticles,
      };
    } else {
      const latestEditedFiltered = latestEditedArticles.filter(
        id => id !== articleId,
      );
      latestEditedFiltered.splice(0, 0, articleId);
      userUpdatedMetadata = {
        latestEditedArticles: latestEditedFiltered,
      };
    }

    draftApi.updateUserData(userUpdatedMetadata);
  };

  return {
    article,
    setArticle,
    updateArticle,
    createArticle,
    updateArticleAndStatus,
    loading,
  };
}
