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

const statusMessages = {
  409: 'errorMessage.statusCode.409',
};

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
    const {
      payload: { id, language },
    } = yield take(actions.fetchDraft);
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
    if (statusMessages[error.status]) {
      yield put(
        messageActions.addMessage({
          severity: 'danger',
          translationKey: statusMessages[error.status],
          timeToLive: 0,
        }),
      );
    } else {
      yield put(messageActions.showSaved());
      yield put(messageActions.applicationError(error));
    }
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
    const {
      payload: { draft, history },
    } = yield take(actions.updateDraft);
    if (draft.id) {
      yield call(updateDraft, draft);
    } else {
      yield call(createDraft, draft, history);
    }
  }
}

export function* updateStatusDraft(id, status) {
  try {
    const statusChangedDraft = yield call(api.updateStatusDraft, id, status);
    const currentDraft = yield select(getDraft(id));

    yield put(actions.setDraft({ ...currentDraft, ...statusChangedDraft })); // Quick hack to set draft language on updated draft. Maybe language should not be on model?
    yield put(actions.updateDraftSuccess());
  } catch (error) {
    yield put(actions.updateDraftError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* watchUpdateStatusDraft() {
  while (true) {
    const {
      payload: { id, status },
    } = yield take(actions.updateStatusDraft);
    if (id && status) {
      yield call(updateStatusDraft, id, status);
    }
  }
}

export default [watchUpdateStatusDraft, watchFetchDraft, watchUpdateDraft];
