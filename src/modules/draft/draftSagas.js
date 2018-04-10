/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { actions, getDraft } from './draft';
import * as api from './draftApi';
import { toEditArticle } from '../../util/routeHelpers';
import * as messageActions from '../../containers/Messages/messagesActions';

export function* fetchDraft(id, language) {
  try {
    const draft = yield call(api.fetchDraft, id, language);
    yield put(actions.setDraft({ ...draft, language }));
  } catch (error) {
    // TODO: handle error
    console.error(error); // eslint-disable-line no-console
  }
}

export function* watchFetchDraft() {
  while (true) {
    const { payload: { id, language } } = yield take(actions.fetchDraft);
    const draft = yield select(getDraft(id));
    if (!draft || draft.id !== id || draft.language !== language) {
      yield call(fetchDraft, id, language);
    }
  }
}

export function* updateDraft(draft) {
  try {
    const updatedDraft = yield call(api.updateDraft, draft);
    yield put(actions.setDraft(updatedDraft));
    yield put(actions.updateDraftSuccess());
    yield put(messageActions.showSaved());
  } catch (error) {
    yield put(actions.updateDraftError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* createDraft(draft, history) {
  try {
    const createdDraft = yield call(api.createDraft, draft);
    yield put(actions.setDraft(createdDraft));
    yield put(actions.updateDraftSuccess());
    yield put(messageActions.showSaved());
    history.push(
      toEditArticle(createdDraft.id, createdDraft.articleType, draft.language),
    );
  } catch (error) {
    yield put(actions.updateDraftError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* watchUpdateDraft() {
  while (true) {
    const { payload: { draft, history } } = yield take(actions.updateDraft);
    if (draft.id) {
      yield call(updateDraft, draft);
    } else {
      yield call(createDraft, draft, history);
    }
  }
}

export function* publishDraft(draft) {
  try {
    const publishedDraft = yield call(api.publishDraft, draft.id);
    const currentDraft = yield select(getDraft(draft.id));

    yield put(actions.setDraft({ ...currentDraft, ...publishedDraft })); // Quick hack to set draft language on updated draft. Maybe language should not be on model?
    yield put(actions.updateDraftSuccess());
    yield put(
      messageActions.addMessage({ translationKey: 'form.publishedOk' }),
    );
  } catch (error) {
    yield put(actions.updateDraftError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* watchPublishDraft() {
  while (true) {
    const { payload: { draft } } = yield take(actions.publishDraft);
    if (draft.id) {
      yield call(publishDraft, draft);
    }
  }
}

export default [watchPublishDraft, watchFetchDraft, watchUpdateDraft];
