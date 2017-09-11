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
import {
  titleI18N,
  tagsI18N,
  introductionI18N,
  visualElementI18N,
  metaDescriptionI18N,
  contentI18N,
} from '../../util/i18nFieldFinder';
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
            title: titleI18N(article, locale, true),
            introduction: introductionI18N(article, locale, true),
            visualElement: visualElementI18N(article, locale, true),
            content: contentI18N(article, locale, true),
            metaDescription: metaDescriptionI18N(article, locale, true),
            tags: tagsI18N(article, locale, true),
            created: formatDate(article.created, locale),
            updated: formatDate(article.updated, locale),
          }
        : undefined,
  );
