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

export function useFetchArticleData(articleId, locale) {
  const [article, setArticle] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const fetchArticle = async () => {
    if (articleId) {
      setLoading(true);
      const article = await draftApi.fetchDraft(articleId, locale);
      setArticle(transformArticleFromApiVersion(article, locale));
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

  useEffect(() => {
    fetchArticle();
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
    refetchArticle: fetchArticle,
  };
}
