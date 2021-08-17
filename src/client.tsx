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
import IntlProvider from '@ndla/i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';
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
import Spinner from './components/Spinner';

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
  const history = useHistory();
  const [lang, setLang] = useState(basename);
  const firstRender = useRef(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeI18n(i18n);
    i18n.loadLanguages(i18n.options.supportedLngs as string[]);
    i18n.loadResources(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      const storedLang = window.localStorage.getItem(STORED_LANGUAGE_KEY);
      if (
        !basename &&
        storedLang &&
        isValidLocale(storedLang) &&
        storedLang !== getDefaultLanguage()
      ) {
        setLang(storedLang);
        if (!window.location.pathname.includes('/login/success')) {
          history.replace(`/${storedLang}${window.location.pathname}`);
        }
      }

      return;
    }
    changeBaseName(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const changeBaseName = () => {
    const supportedLanguages: string[] = i18n.options.supportedLngs as string[]; // hard-coded as a string array in i18n2.ts.
    const regex = new RegExp(supportedLanguages.map(l => `/${l}/`).join('|'));
    const paths = window.location.pathname.replace(regex, '').split('/');
    const { search } = window.location;
    const path = paths.slice().join('/');
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    history.replace(`/${i18n.language}${fullPath}${search}`);
    setLang(i18n.language);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <BrowserRouter basename={lang} key={lang}>
      <IntlProvider locale={i18n.language} messages={getLocaleObject(i18n.language).messages}>
        <App key={lang} />
      </IntlProvider>
    </BrowserRouter>
  );
};

const renderApp = () => {
  render(
    //@ts-ignore i18nInstance is not recognized as valid by I18nextProvider. It works, however.
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
