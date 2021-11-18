/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Router, useHistory } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import ErrorReporter from '@ndla/error-reporter';
import { createBrowserHistory } from 'history';
import { i18nInstance } from '@ndla/ui';
import config, { ConfigType, getDefaultLanguage } from './config';
import { isValidLocale } from './i18n';
import App from './containers/App/App';
import { initializeI18n, supportedLanguages } from './i18n2';
import { STORED_LANGUAGE_KEY } from './constants';
import Spinner from './components/Spinner';
import { LocaleType } from './interfaces';

declare global {
  interface Window {
    initialState: {
      locale: string;
    };
    errorReporter: any;
    config: ConfigType;
  }
}

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : undefined;

const { logglyApiKey, logEnvironment: environment, componentName } = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
});

const browserHistory = createBrowserHistory();

const I18nWrapper = ({ basename }: { basename?: string }) => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [base, setBase] = useState('');
  const firstRender = useRef(true);

  useEffect(() => {
    initializeI18n(i18n);
    i18n.loadLanguages(i18n.options.supportedLngs as string[]);
    i18n.loadResources(() => setLoading(false));
    const storedLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY) as LocaleType;
    const defaultLanguage = getDefaultLanguage();
    if ((!basename && !storedLanguage) || (!basename && storedLanguage === defaultLanguage)) {
      setBase('');
      i18n.changeLanguage(defaultLanguage);
    } else if (storedLanguage && isValidLocale(storedLanguage)) {
      i18n.changeLanguage(storedLanguage);
      setBase(i18n.language);
    }
  }, [basename, i18n]);

  useEffect(() => {
    if (!firstRender.current) {
      setBase(i18n.language);
    }
    firstRender.current = false;
  }, [i18n.language]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <BrowserRouter basename={base} key={base}>
      <LocaleRedirector base={base} />
    </BrowserRouter>
  );
};

const LocaleRedirector = ({ base }: { base: string }) => {
  const { i18n } = useTranslation();
  const history = useHistory();
  useEffect(() => {
    const regex = new RegExp(supportedLanguages.map(l => `/${l}/`).join('|'));
    const path = window.location.pathname.replace(regex, '');
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    if (!window.location.pathname.includes('/login/success')) {
      history.replace(`${fullPath}${window.location.search}`);
    }
  }, [base, history]);
  return <App key={i18n.language} isClient={true} />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const renderApp = () => {
  render(
    <QueryClientProvider client={queryClient}>
      {/* @ts-ignore i18nInstance is not recognized as valid by I18nextProvider. It works, however. */}
      <I18nextProvider i18n={i18nInstance}>
        <Router history={browserHistory}>
          <I18nWrapper basename={basename} />
        </Router>
      </I18nextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>,
    document.getElementById('root'),
  );
};
renderApp();

if (module.hot) {
  module.hot.accept('./containers/App/App', () => {
    renderApp();
  });
}
