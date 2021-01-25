/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import * as draftApi from '../../modules/draft/draftApi';
import { fetchConcept } from '../../modules/concept/conceptApi';
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

      let convertedConcepts = await fetchElementList(article.conceptIds);
      convertedConcepts = convertedConcepts.map(e => ({
        ...e,
        articleType: 'concept',
      }));
      const taxonomy = await fetchTaxonomy(articleId, locale);
      setArticle(
        transformArticleFromApiVersion(
          { taxonomy, ...article },
          locale,
          convertedConcepts,
        ),
      );
      setLoading(false);
    }
  };

  const updateArticle = async updatedArticle => {
    const conceptIds = updatedArticle.conceptIds.map(concept => concept.id);
    const savedArticle = await draftApi.updateDraft({
      ...updatedArticle,
      conceptIds,
    });
    const taxonomy = await fetchTaxonomy(articleId, locale);
    const updated = transformArticleFromApiVersion(
      { taxonomy, ...savedArticle },
      locale,
      updatedArticle.conceptIds,
    );
    updateUserData(articleId);
    setArticle(updated);
    return updated;
  };

  const fetchElementList = async articleIds => {
    return Promise.all(
      articleIds
        .filter(a => !!a)
        .map(async elementId => {
          return fetchConcept(elementId);
        }),
    );
  };

  const updateArticleAndStatus = async ({
    updatedArticle,
    newStatus,
    dirty,
  }) => {
    let newArticle = updatedArticle;
    if (dirty) {
      const conceptIds = updatedArticle.conceptIds.map(concept => concept.id);
      const savedArticle = await draftApi.updateDraft({
        ...updatedArticle,
        conceptIds,
      });
      newArticle = transformArticleFromApiVersion(
        savedArticle,
        locale,
        updatedArticle.conceptIds,
      );
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
    const conceptIds = createdArticle.conceptIds.map(concept => concept.id);
    const savedArticle = await draftApi.createDraft({
      ...createdArticle,
      conceptIds,
    });
    setArticle(
      transformArticleFromApiVersion(
        savedArticle,
        locale,
        createdArticle.conceptIds,
      ),
    );
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
