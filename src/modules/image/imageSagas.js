/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { actions, getImageById } from './image';
import * as api from './imageApi';
import * as messageActions from '../../containers/Messages/messagesActions';
import { createFormData } from '../../util/formDataHelper';
import { toEditImage } from '../../util/routeHelpers';

export function* fetchImage(id, locale) {
  try {
    const image = yield call(api.fetchImage, id, locale);
    yield put(actions.setImage(image));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchImage() {
  while (true) {
    const { payload: { id, locale } } = yield take(actions.fetchImage);
    const image = yield select(getImageById(id));
    if (!image || image.id !== id) {
      yield call(fetchImage, id, locale);
    }
  }
}

export function* updateImage(image, file) {
  try {
    const formData = yield call(createFormData, image, file);
    const updatedImage = yield call(api.updateImage, image.id, formData);
    yield put(actions.setImage(updatedImage));
    yield put(actions.updateImageSuccess());
    yield put(
      messageActions.addMessage({ translationKey: 'imageForm.savedOk' }),
    );
  } catch (error) {
    yield put(actions.updateImageError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* createImage(image, file, history) {
  try {
    const formData = yield call(createFormData, image, file);
    const createdImage = yield call(api.postImage, formData);
    yield put(actions.setImage(createdImage));
    history.push(toEditImage(createdImage.id));
    yield put(actions.updateImageSuccess());
    yield put(
      messageActions.addMessage({
        translationKey: 'imageForm.createdOk',
      }),
    );
  } catch (error) {
    yield put(actions.updateImageError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* watchUpdateImage() {
  while (true) {
    const { payload: { image, file, history } } = yield take(
      actions.updateImage,
    );
    if (image.id) {
      yield call(updateImage, image, file);
    } else {
      yield call(createImage, image, file, history);
    }
  }
}

export default [watchFetchImage, watchUpdateImage];
