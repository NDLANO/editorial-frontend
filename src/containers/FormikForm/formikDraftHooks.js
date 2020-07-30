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

  const updateLastEditedArticles = async articleId => {
    // const result = await draftApi.fetchUserData();
    // const latestEditedArticles = result.lastEditedArticles || [];
    const latestEditedArticles = [];

    if (!latestEditedArticles.includes(articleId)) {
      latestEditedArticles.push(articleId);
      const userUpdatedMetadata = {
        latestEditedArticles: latestEditedArticles,
      };
      console.log('userUpdatedMetadata', userUpdatedMetadata); // TODO remove

      draftApi.updateUserData(userUpdatedMetadata);
    }
  };

  const updateArticle = async updatedArticle => {
    const savedArticle = await draftApi.updateDraft(updatedArticle);
    const taxonomy = await fetchTaxonomy(articleId, locale);
    // updateLastEditedArticles(articleId); // TODO: test at kallet virker

    const updated = transformArticleFromApiVersion(
      { taxonomy, ...savedArticle },
      locale,
    );
    setArticle(updated);
    return updated;
  };

  const createArticle = async createdArticle => {
    const savedArticle = await draftApi.createDraft(createdArticle);
    setArticle(transformArticleFromApiVersion(savedArticle, locale));
    // updateLastEditedArticles(savedArticle.id);  TODO: test at kallet virker
    return savedArticle;
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

  useEffect(() => {
    fetchArticle();
  }, [articleId, locale]);

  return {
    article,
    setArticle,
    updateArticle,
    createArticle,
    updateArticleAndStatus,
    loading,
  };
}
