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

export const fetchDraft = createAction('FETCH_DRAFT');
export const setDraft = createAction('SET_DRAFT');
export const updateDraft = createAction('UPDATE_DRAFT');
export const updateDraftSuccess = createAction('UPDATE_DRAFT_SUCCESS');
export const updateDraftError = createAction('UPDATE_DRAFT_ERROR');
export const publishDraft = createAction('PUBLISH_DRAFT');

export const actions = {
  updateDraft,
  fetchDraft,
  setDraft,
  updateDraftSuccess,
  updateDraftError,
  publishDraft,
};

const initalState = {
  all: {},
  isSaving: false,
};

export default handleActions(
  {
    [setDraft]: {
      next: (state, action) => ({
        ...state,
        all: { ...state.all, [action.payload.id]: { ...action.payload } },
      }),
      throw: state => state,
    },
    [updateDraft]: {
      next: state => ({
        ...state,
        isSaving: true,
      }),
      throw: state => state,
    },
    [publishDraft]: {
      next: state => ({
        ...state,
        isSaving: true,
      }),
      throw: state => state,
    },
    [updateDraftSuccess]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
      throw: state => state,
    },
    [updateDraftError]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getDraftsFromState = state => state.drafts;

export const getDraftById = draftId =>
  createSelector([getDraftsFromState], drafts => drafts.all[draftId]);

export const getSaving = createSelector(
  [getDraftsFromState],
  drafts => drafts.isSaving,
);

export const getDraft = (articleId, useLanguage = false) =>
  createSelector([getDraftById(articleId), getLocale], (article, locale) => {
    const articleLanguage =
      article && useLanguage ? article.language : undefined;
    return article
      ? {
          ...article,
          title: convertFieldWithFallback(
            article,
            'title',
            '',
            articleLanguage,
          ),
          introduction: convertFieldWithFallback(
            article,
            'introduction',
            '',
            articleLanguage,
          ),
          visualElement: convertFieldWithFallback(
            article,
            'visualElement',
            {},
            articleLanguage,
          ),
          content: convertFieldWithFallback(
            article,
            'content',
            '',
            articleLanguage,
          ),
          footnotes:
            article.content && article.content.footNotes
              ? article.content.footNotes
              : undefined,
          metaDescription: convertFieldWithFallback(
            article,
            'metaDescription',
            '',
            articleLanguage,
          ),
          tags: convertFieldWithFallback(article, 'tags', [], articleLanguage),
          created: formatDate(article.created, locale),
          updated: formatDate(article.updated, locale),
        }
      : undefined;
  });
