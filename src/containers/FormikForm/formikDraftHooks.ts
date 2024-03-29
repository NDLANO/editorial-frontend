/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniq from "lodash/uniq";
import { useState, useEffect, useCallback } from "react";
import { INewArticle, IUpdatedArticle, IArticle } from "@ndla/types-backend/draft-api";
import { LAST_UPDATED_SIZE } from "../../constants";
import {
  fetchDraft,
  updateDraft,
  createDraft,
  fetchUserData,
  updateUserData as apiUpdateUserData,
} from "../../modules/draft/draftApi";
import { useDraftHistory } from "../../modules/draft/draftQueries";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

export function useFetchArticleData(articleId: number | undefined, language: string) {
  const [article, _setArticle] = useState<IArticle | undefined>(undefined);
  const [articleChanged, setArticleChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const { taxonomyVersion } = useTaxonomyVersion();
  const articleHistory = useDraftHistory({ id: articleId!, language: language }, { enabled: !!articleId });

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        setLoading(true);
        const article = await fetchDraft(articleId, language);
        _setArticle(article);
        setArticleChanged(false);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, language, taxonomyVersion]);

  const updateUserData = useCallback(async (articleId: number) => {
    const stringId = articleId.toString();
    const result = await fetchUserData();
    const latest = uniq([stringId].concat(result.latestEditedArticles ?? []));
    const latestEditedArticles = latest.slice(0, LAST_UPDATED_SIZE);
    apiUpdateUserData({ latestEditedArticles });
  }, []);

  const updateArticle = useCallback(
    async (updatedArticle: IUpdatedArticle): Promise<IArticle> => {
      if (!articleId) throw new Error("Received article without id when updating");
      const savedArticle = await updateDraft(articleId, updatedArticle);
      await updateUserData(savedArticle.id);
      _setArticle(savedArticle);
      setArticleChanged(false);
      return savedArticle;
    },
    [articleId, updateUserData],
  );

  const createArticle = useCallback(
    async (createdArticle: INewArticle) => {
      const savedArticle = await createDraft(createdArticle);
      _setArticle(savedArticle);
      setArticleChanged(false);
      await updateUserData(savedArticle.id);
      return savedArticle;
    },
    [updateUserData],
  );

  const setArticle = useCallback((article: IArticle) => {
    _setArticle(article);
    setArticleChanged(true);
  }, []);

  return {
    article,
    articleHistory,
    setArticle,
    articleChanged,
    updateArticle,
    createArticle,
    loading,
  };
}
