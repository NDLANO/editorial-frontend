/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';

import { createSelector } from 'reselect';
import { getLocale } from '../locale/locale';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import formatDate from '../../util/formatDate';

export const fetchArticle = createAction('FETCH_ARTICLE');
export const fetchTopicArticle = createAction('FETCH_TOPIC_ARTICLE');
export const setArticle = createAction('SET_ARTICLE');
export const updateArticle = createAction('UPDATE_ARTICLE');
export const updateArticleSuccess = createAction('UPDATE_ARTICLE_SUCCESS');
export const updateArticleError = createAction('UPDATE_ARTICLE_ERROR');

export const actions = {
  updateArticle,
  fetchArticle,
  setArticle,
  updateArticleSuccess,
  updateArticleError,
  fetchTopicArticle,
};

const initalState = {
  all: {},
  isSaving: false,
};

export default handleActions(
  {
    [setArticle]: {
      next: (state, action) => ({
        ...state,
        all: { ...state.all, [action.payload.id]: { ...action.payload } },
      }),
      throw: state => state,
    },
    [updateArticle]: {
      next: state => ({
        ...state,
        isSaving: true,
      }),
      throw: state => state,
    },
    [updateArticleSuccess]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
      throw: state => state,
    },
    [updateArticleError]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getArticlesFromState = state => state.articles;

export const getArticleById = articleId =>
  createSelector([getArticlesFromState], articles => articles.all[articleId]);

export const getSaving = createSelector(
  [getArticlesFromState],
  articles => articles.isSaving,
);

export const getArticle = articleId =>
  createSelector(
    [getArticleById(articleId), getLocale],
    (article, locale) =>
      article
        ? {
            ...article,
            title: convertFieldWithFallback(article, 'title', ''),
            introduction: convertFieldWithFallback(article, 'introduction', ''),
            visualElement: convertFieldWithFallback(
              article,
              'visualElement',
              {},
            ),
            content: convertFieldWithFallback(article, 'content', ''),
            metaDescription: convertFieldWithFallback(
              article,
              'metaDescription',
              '',
            ),
            tags: convertFieldWithFallback(article, 'tags', []),
            created: formatDate(article.created, locale),
            updated: formatDate(article.updated, locale),
          }
        : undefined,
  );
