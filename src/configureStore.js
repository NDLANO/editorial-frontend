/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers';
import rootSaga from './sagas';
import { errorReporter } from './middleware';

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const createFinalStore = compose(
    applyMiddleware(sagaMiddleware, errorReporter),
    process.env.BUILD_TARGET === 'client' &&
      window &&
      window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f,
  )(createStore);

  const store = createFinalStore(rootReducer, initialState);

  sagaMiddleware.run(rootSaga);

  return store;
}
