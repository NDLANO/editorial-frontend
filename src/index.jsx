/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import ErrorReporter from 'ndla-error-reporter';
import routes from './routes';

import { getLocaleObject, isValidLocale } from './i18n';
import configureStore from './configureStore';
import { expiresIn } from './util/jwtHelper';

const initialState = window.initialState;
const localeString = initialState.locale;
const locale = getLocaleObject(localeString);

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : '';

window.accessToken = initialState.accessToken; // tmp hack
localStorage.setItem('access_token', initialState.accessToken);
localStorage.setItem('access_token_expires_at', (expiresIn(initialState.accessToken) * 1000) + new Date().getTime());

const store = configureStore(initialState);

const { logglyApiKey, logEnvironment: environment, componentName } = window.config;
window.errorReporter = ErrorReporter.getInstance({ store, logglyApiKey, environment, componentName });

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
      <BrowserRouter basename={basename}>
        {routes}
      </BrowserRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById('root'),
);
