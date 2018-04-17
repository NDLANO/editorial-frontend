/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import IntlProvider from 'ndla-i18n';
import ErrorReporter from 'ndla-error-reporter';

import config from './config';
import { getLocaleObject, isValidLocale } from './i18n';
import configureStore from './configureStore';
import { getSessionStateFromLocalStorage } from './modules/session/session';
import App from './containers/App/App';

const { initialState } = window;
const localeString = initialState.locale;
const locale = getLocaleObject(localeString);

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : '';

const store = configureStore({
  ...initialState,
  session: getSessionStateFromLocalStorage(),
});

const { logglyApiKey, logEnvironment: environment, componentName } = config;

window.errorReporter = ErrorReporter.getInstance({
  store,
  logglyApiKey,
  environment,
  componentName,
});

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById('root'),
);
