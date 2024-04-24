/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorReporter } from "@ndla/error-reporter";
import { i18nInstance } from "@ndla/ui";
import config, { ConfigType } from "./config";
import App from "./containers/App/App";
import { isValidLocale } from "./i18n";
import { initializeI18n } from "./i18n2";

declare global {
  interface Window {
    h5pResizerInitialized?: boolean;
    errorReporter: any;
    config: ConfigType;
  }
}

const paths = window.location.pathname.split("/");

const lang = isValidLocale(paths[1]) ? paths[1] : undefined;

const i18n = initializeI18n(i18nInstance, lang ?? config.defaultLanguage);

const { logglyApiKey, logEnvironment: environment, componentName } = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const renderApp = () => {
  const container = document.getElementById("root")!;
  const root = createRoot(container);
  root.render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter basename={lang}>
            <App />
          </BrowserRouter>
        </I18nextProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </HelmetProvider>,
  );
};
renderApp();
