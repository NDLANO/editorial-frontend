/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';

import { createSelector } from 'reselect';
import { getLocale } from '../Locale/localeSelectors';
import { titleI18N, tagsI18N, introductionI18N, metaDescriptionI18N, contentI18N } from '../../util/i18nFieldFinder';
import formatDate from '../../util/formatDate';

export const fetchArticle = createAction('FETCH_ARTICLE');
export const setArticle = createAction('SET_ARTICLE');
export const updateArticle = createAction('UPDATE_ARTICLE');

export const actions = {
  updateArticle,
  fetchArticle,
  setArticle,
};

const initalState = {};

export default handleActions({
  [setArticle]: {
    next: (state, action) => ({ ...state, [action.payload.id]: { ...action.payload } }),
    throw: state => state,
  },
}, initalState);

const getArticleFromState = state => state.articles;

export const getArticleById = articleId => createSelector(
  [getArticleFromState],
  articles => articles[articleId],
);

export const getArticle = articleId => createSelector(
  [getArticleById(articleId), getLocale],
  (article, locale) => (
    article ? {
      ...article,
      title: titleI18N(article, locale, true),
      introduction: introductionI18N(article, locale, true),
      content: contentI18N(article, locale, true),
      metaDescription: metaDescriptionI18N(article, locale, true),
      tags: tagsI18N(article, locale, true),
      created: formatDate(article.created, locale),
      updated: formatDate(article.updated, locale),
    } : undefined
  ),
);
