/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { actions, getAudioById } from './audio';
import * as api from './audioApi';
import * as messageActions from '../../containers/Messages/messagesActions';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';

export function* fetchAudio(id, language) {
  try {
    const audio = yield call(api.fetchAudio, id, language);
    yield put(actions.setAudio({ ...audio, language }));
  } catch (error) {
    // TODO: handle error
    console.error(error); // eslint-disable-line no-console
  }
}

export function* watchFetchAudio() {
  while (true) {
    const {
      payload: { id, language },
    } = yield take(actions.fetchAudio);
    const audio = yield select(getAudioById(id));
    if (!audio || audio.id !== id || audio.language !== language) {
      yield call(fetchAudio, id, language);
    }
  }
}

export function* updateAudio(audio, file) {
  try {
    const formData = yield call(createFormData, audio, file);
    const updatedAudio = yield call(api.updateAudio, audio.id, formData);
    yield put(actions.setAudio({ ...updatedAudio, language: audio.language }));
    yield put(actions.updateAudioSuccess());
    yield put(messageActions.showSaved());
  } catch (error) {
    yield put(actions.updateAudioError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* createAudio(audio, file, history) {
  try {
    const formData = yield call(createFormData, audio, file);
    const createdAudio = yield call(api.postAudio, formData);
    yield put(actions.setAudio({ ...createdAudio, language: audio.language }));
    yield put(actions.updateAudioSuccess());
    yield put(messageActions.showSaved());
    history.push(toEditAudio(createdAudio.id, audio.language));
  } catch (error) {
    yield put(actions.updateAudioError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* watchUpdateAudio() {
  while (true) {
    const {
      payload: { audio, file, history },
    } = yield take(actions.updateAudio);
    if (audio.id) {
      yield call(updateAudio, audio, file);
    } else {
      yield call(createAudio, audio, file, history);
    }
  }
}

export default [watchFetchAudio, watchUpdateAudio];
