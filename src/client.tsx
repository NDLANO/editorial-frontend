/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import ErrorReporter from '@ndla/error-reporter';
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

const constructNewPath = (newLocale?: LocaleType) => {
  const regex = new RegExp(supportedLanguages.map(l => `/${l}/`).join('|'));
  const path = window.location.pathname.replace(regex, '');
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const localePrefix = newLocale ? `/${newLocale}` : '';
  return `${localePrefix}${fullPath}${window.location.search}`;
};

const AppWrapper = ({ basename }: { basename?: string }) => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [base, setBase] = useState('');
  const firstRender = useRef(true);

  useEffect(() => {
    initializeI18n(i18n);
    i18n.loadLanguages(supportedLanguages);
    i18n.loadResources(() => setLoading(false));
    const storedLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY) as LocaleType;
    const defaultLanguage = getDefaultLanguage();
    if ((!basename && !storedLanguage) || (!basename && storedLanguage === defaultLanguage)) {
      i18n.changeLanguage(defaultLanguage);
    } else if (storedLanguage && isValidLocale(storedLanguage)) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [basename, i18n]);

  // handle path changes when the language is changed
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      window.history.replaceState('', '', constructNewPath(i18n.language));
      setBase(i18n.language);
    }
  }, [i18n.language]);

  // handle initial redirect if URL has wrong or missing locale prefix.
  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY) as LocaleType;
    if ((!storedLanguage || storedLanguage === getDefaultLanguage()) && !basename) return;
    if (isValidLocale(storedLanguage) && storedLanguage === basename) {
      setBase(storedLanguage);
      return;
    }
    if (window.location.pathname.includes('/login/success')) return;
    setBase(storedLanguage);
    window.history.replaceState('', '', constructNewPath(storedLanguage));
  }, [basename]);

  if (loading) return <Spinner />;
  return <RouterComponent base={base} />;
};

const RouterComponent = ({ base }: { base: string }) => {
  return (
    <BrowserRouter key={base} basename={base}>
      <App isClient={true} key={base} />
    </BrowserRouter>
  );
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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18nInstance}>
          <AppWrapper basename={basename} />
        </I18nextProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </HelmetProvider>,
    document.getElementById('root'),
  );
};
renderApp();

if (module.hot) {
  module.hot.accept('./containers/App/App', () => {
    renderApp();
  });
}
