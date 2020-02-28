/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import * as draftApi from '../../modules/draft/draftApi';
import { fetchNnTranslation } from '../../modules/translate/translateApi';
import { transformArticleFromApiVersion } from '../../util/articleUtil';
import { queryResources, queryTopics } from '../../modules/taxonomy/resources';

export function useFetchArticleData(articleId, locale) {
  const [article, setArticle] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [tags, setTags] = useState([]);

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
    setArticle(transformArticleFromApiVersion(savedArticle, locale));
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
    setArticle({
      ...newArticle,
      notes: statusChangedDraft.notes,
      status: statusChangedDraft.status,
      revision: statusChangedDraft.revision,
    });
  };

  const createArticle = async createdArticle => {
    const savedArticle = await draftApi.createDraft(createdArticle);
    setArticle(transformArticleFromApiVersion(savedArticle, locale));
    return savedArticle;
  };

  const fetchTags = async () => {
    const newTags = await draftApi.fetchTags(locale);
    setTags(newTags ? newTags.tags : []);
  };

  const translateArticle = async () => {
    const { title, metaDescription, introduction, content } = article;
    const translatedArticleContents = await fetchNnTranslation({
      title,
      metaDescription,
      introduction,
      content,
    });
    setArticle({
      ...article,
      ...translatedArticleContents.document,
      language: 'nn',
      supportedLanguages: ['nb'],
    });
    setTranslating(false);
  };

  useEffect(() => {
    !translating && fetchArticle();
  }, [articleId, locale]);

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    article,
    updateArticle,
    createArticle,
    updateArticleAndStatus,
    loading,
    translateArticle,
    translating,
    setTranslating,
  };
}
