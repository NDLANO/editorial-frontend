/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import persistState from 'redux-localstorage';


import rootReducer from './reducers';
import rootSaga from './sagas';
import { errorReporter } from './middleware';

const slicer = paths =>
  // custom slicer because default slicer does not store falsy values
  state => paths.reduce((acc, path) => {
    // eslint-disable-next-line no-param-reassign
    acc[path] = state[path];
    return acc;
  }, {});


export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const createFinalStore = compose(
    applyMiddleware(
      thunkMiddleware,
      sagaMiddleware,
      errorReporter,
    ),
    persistState(['authenticated', 'user'], { key: 'ndla.no', slicer }),
    window && window.devToolsExtension ? window.devToolsExtension() : f => f,
  )(createStore);

  const store = createFinalStore(rootReducer, initialState);

  sagaMiddleware.run(rootSaga);

  return store;
}
