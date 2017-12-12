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

export function* fetchDraft(id, language = 'nb') {
  try {
    const tempDraft = yield call(api.fetchDraft, id);
    if (tempDraft.supportedLanguages.includes(language)) {
      const draft = yield call(api.fetchDraft, id, language);
      yield put(actions.setDraft({ ...draft, language }));
    } else {
      yield put(
        actions.setDraft({
          id: tempDraft.id,
          language,
          copyright: tempDraft.copyright,
          articleType: tempDraft.articleType,
          revision: tempDraft.revision,
          supportedLanguages: tempDraft.supportedLanguages,
        }),
      );
    }
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchDraft() {
  while (true) {
    const { payload: { id, language } } = yield take(actions.fetchDraft);
    // console.log('called');
    const draft = yield select(getDraft(id));
    if (!draft || draft.id !== id || draft.language !== language) {
      yield call(fetchDraft, id, language);
    }
  }
}

export function* updateDraft(draft) {
  try {
    const updatedDraft = yield call(api.updateDraft, draft);
    yield put(actions.setDraft({ ...updatedDraft, language: draft.language })); // Quick hack to set draft language on updated draft. Maybe language should not be on model?
    yield put(actions.updateDraftSuccess());
    yield put(messageActions.addMessage({ translationKey: 'form.savedOk' }));
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
    history.push(
      toEditArticle(createdDraft.id, createdDraft.articleType, draft.language),
    );
    yield put(actions.updateDraftSuccess());
    yield put(
      messageActions.addMessage({
        translationKey: 'form.createdOk',
      }),
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
    const updatedDraft = yield call(api.publishDraft, draft.id);
    yield put(actions.setDraft({ ...updatedDraft, language: draft.language })); // Quick hack to set draft language on updated draft. Maybe language should not be on model?
    yield put(actions.updateDraftSuccess());
    yield put(messageActions.addMessage({ translationKey: 'form.savedOk' }));
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
