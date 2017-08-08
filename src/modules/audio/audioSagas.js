/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put } from 'redux-saga/effects';
import { actions } from './audio';
import * as api from './audioApi';
import * as messageActions from '../../containers/Messages/messagesActions';
import { createFormData } from '../../util/formDataHelper';

export function* updateAudio(audio, file) {
  try {
    const updatedAudio = yield call(api.updateAudio, audio, file);
    yield put(actions.setAudio(updatedAudio));
    yield put(actions.updateAudioSuccess());
    yield put(
      messageActions.addMessage({ translationKey: 'audioForm.savedOk' }),
    );
  } catch (error) {
    yield put(actions.updateAudioError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* createAudio(audio, file) {
  try {
    const formData = yield call(createFormData, audio, file);
    const createdAudio = yield call(api.postAudio, formData);
    yield put(actions.setAudio(createdAudio));
    // history.push(toEditAudio(createdAudio.id, createdAudio.audioType));
    yield put(actions.updateAudioSuccess());
    yield put(
      messageActions.addMessage({
        translationKey: 'audioForm.createdOk',
      }),
    );
  } catch (error) {
    yield put(actions.updateAudioError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* watchUpdateAudio() {
  while (true) {
    const { payload: { audio, file, history } } = yield take(
      actions.updateAudio,
    );
    if (audio.id) {
      yield call(updateAudio, audio, file);
    } else {
      yield call(createAudio, audio, file, history);
    }
  }
}

export default [watchUpdateAudio];
