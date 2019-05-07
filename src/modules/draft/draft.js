/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';
import { createSelector } from 'reselect';
import { transformArticleFromApiVersion } from '../../util/articleUtil';

export const fetchDraft = createAction('FETCH_DRAFT');
export const setDraft = createAction('SET_DRAFT');
export const updateDraft = createAction('UPDATE_DRAFT');
export const updateDraftSuccess = createAction('UPDATE_DRAFT_SUCCESS');
export const updateDraftError = createAction('UPDATE_DRAFT_ERROR');
export const updateStatusDraft = createAction('UPDATE_STATUS_DRAFT');

export const actions = {
  updateDraft,
  fetchDraft,
  setDraft,
  updateDraftSuccess,
  updateDraftError,
  updateStatusDraft,
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
    },
    [updateDraft]: {
      next: state => ({
        ...state,
        isSaving: true,
      }),
    },
    [updateStatusDraft]: {
      next: state => ({
        ...state,
        isSaving: true,
      }),
    },
    [updateDraftSuccess]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
    },
    [updateDraftError]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
    },
  },
  initalState,
);

const getDraftsFromState = state => state.drafts;

export const getDraftById = draftId =>
  createSelector(
    [getDraftsFromState],
    drafts => drafts.all[draftId],
  );

export const getSaving = createSelector(
  [getDraftsFromState],
  drafts => drafts.isSaving,
);

export const getDraft = articleId =>
  createSelector(
    [getDraftById(articleId)],
    article => (article ? transformArticleFromApiVersion(article) : undefined),
  );
