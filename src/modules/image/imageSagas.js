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

export function* fetchImage(id, language) {
  try {
    const image = yield call(api.fetchImage, id, language);
    yield put(actions.setImage({ ...image, language }));
  } catch (error) {
    // TODO: handle error
    console.error(error); // eslint-disable-line no-console
  }
}

export function* watchFetchImage() {
  while (true) {
    const {
      payload: { id, language },
    } = yield take(actions.fetchImage);
    const image = yield select(getImageById(id));
    if (!image || image.id !== id || image.language !== language) {
      yield call(fetchImage, id, language);
    }
  }
}

export function* updateImage(image) {
  try {
    const updatedImage = yield call(api.updateImage, image);
    yield put(actions.setImage({ ...updatedImage, language: image.language }));
    yield put(actions.updateImageSuccess());
    yield put(messageActions.showSaved());
  } catch (error) {
    yield put(actions.updateImageError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* createImage(image, file, history, editingArticle) {
  try {
    const formData = yield call(createFormData, image, file);
    const createdImage = yield call(api.postImage, formData);
    yield put(actions.setImage({ ...createdImage, language: image.language }));
    yield put(
      actions.updateImageSuccess(editingArticle ? {
        uploadedImage: createdImage,
      } : null),
    );
    yield put(messageActions.showSaved());
    if (!editingArticle) {
      history.push(toEditImage(createdImage.id, image.language));
    }
  } catch (error) {
    yield put(actions.updateImageError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* watchUpdateImage() {
  while (true) {
    const {
      payload: { image, file, history, editingArticle },
    } = yield take(actions.updateImage);
    if (image.id) {
      yield call(updateImage, image);
    } else {
      yield call(createImage, image, file, history, editingArticle);
    }
  }
}

export default [watchFetchImage, watchUpdateImage];
