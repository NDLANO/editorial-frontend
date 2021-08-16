/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Router, useHistory } from 'react-router-dom';
import IntlProvider, { I18nextProvider, useTranslation } from '@ndla/i18n';
import ErrorReporter from '@ndla/error-reporter';
import { configureTracker } from '@ndla/tracker';
import { createBrowserHistory } from 'history';
import { i18nInstance } from '@ndla/ui';
import config, { ConfigType, getDefaultLanguage } from './config';
import { getLocaleObject, isValidLocale } from './i18n';
import configureStore from './configureStore';
import { getSessionStateFromLocalStorage } from './modules/session/session';
import App from './containers/App/App';
import { initializeI18n } from './i18n2';
import { STORED_LANGUAGE_KEY } from './constants';

declare global {
  interface Window {
    initialState: {
      locale: string;
    };
    errorReporter: any;
    config: ConfigType;
  }
}

const { initialState } = window;

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : undefined;
if (basename && isValidLocale(basename)) {
  window.localStorage.setItem(STORED_LANGUAGE_KEY, basename);
}
const storedLang = window.localStorage.getItem(STORED_LANGUAGE_KEY);
if (!basename && storedLang && isValidLocale(storedLang) && storedLang !== getDefaultLanguage()) {
  window.location.href = `${storedLang}${window.location.pathname}`;
}

export const store = configureStore({
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

const browserHistory = createBrowserHistory();

configureTracker({
  listen: browserHistory.listen,
  gaTrackingId: config.gaTrackingId,
  googleTagManagerId: config.googleTagManagerId,
});

const I18nWrapper = ({ basename }: { basename?: string }) => {
  const { i18n } = useTranslation();
  //@ts-ignore
  initializeI18n(i18n);
  const history = useHistory();
  const [lang, setLang] = useState(basename);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const supLangs: string[] = i18n.options.supportedLngs as string[];
    const regex = new RegExp(supLangs.map(l => `/${l}/`).join('|'));
    const paths = window.location.pathname.replace(regex, '').split('/');
    const { search } = window.location;
    const p = paths.slice().join('/');
    const test = p.startsWith('/') ? p : `/${p}`;
    history.replace(`/${i18n.language}${test}${search}`);
    //@ts-ignore
    setLang(i18n.language); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return (
    <BrowserRouter basename={lang} key={lang}>
      <IntlProvider locale={i18n.language} messages={getLocaleObject(i18n.language).messages}>
        <App />
      </IntlProvider>
    </BrowserRouter>
  );
};

const renderApp = () => {
  render(
    <I18nextProvider i18n={i18nInstance}>
      <Provider store={store}>
        <Router history={browserHistory}>
          <I18nWrapper basename={basename} />
        </Router>
      </Provider>
    </I18nextProvider>,
    document.getElementById('root'),
  );
};
renderApp();

if (module.hot) {
  module.hot.accept('./containers/App/App', () => {
    renderApp();
  });
}
