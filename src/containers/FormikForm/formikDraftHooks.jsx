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
  let [article, setArticle] = useState(undefined);
  let [tags, setTags] = useState([]);

  const fetchArticle = async () => {
    if (articleId) {
      const article = await draftApi.fetchDraft(articleId, locale);
      setArticle(transformArticleFromApiVersion(article, locale));
    }
  };

  const updateArticle = async updatedArticle => {
    const savedArticle = await draftApi.updateDraft(updatedArticle);
    setArticle(transformArticleFromApiVersion(savedArticle, locale));
    return savedArticle;
  };

  const updateArticleAndStatus = async (updatedArticle, newStatus) => {
    const savedArticle = await draftApi.updateDraft(updatedArticle);
    const statusChangedDraft = await draftApi.updateStatusDraft(
      updatedArticle.id,
      newStatus,
    );
    setArticle({
      ...transformArticleFromApiVersion(savedArticle, locale),
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
    fetchTags();
  }, [articleId, locale]);

  return {
    tags,
    article,
    updateArticle,
    createArticle,
    updateArticleAndStatus,
  };
}
