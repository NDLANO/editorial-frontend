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
import { Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import ErrorReporter from 'ndla-error-reporter';
import isEmpty from 'lodash/isEmpty';
import createHistory from 'history/createBrowserHistory';
import App from '../src/containers/App/App';

import { getLocaleObject, isValidLocale } from './i18n';
import configureStore from './configureStore';


const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : '';
const initialStateLocale = 'nb';

const browserHistory = basename ? createHistory({ basename }) : createHistory();


const emptyState = {
  authenticated: false,
  accessToken: '',
  idToken: '',
  user: {},
  messages: [],
  locale: initialStateLocale,
};
const initialState = !isEmpty(window.initialState) ? window.initalState : emptyState;
// const initialState = emptyState;
// const localeString = initialState.locale;
const localeString = 'nb';
const locale = getLocaleObject(localeString);

const store = configureStore(initialState, browserHistory);

const { logglyApiKey, logEnvironment: environment, componentName } = window.config;
window.errorReporter = ErrorReporter.getInstance({ store, logglyApiKey, environment, componentName });

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
      <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
        <App />
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root'),
);
