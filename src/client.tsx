/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./style/index.css";
import { ErrorReporter } from "@ndla/error-reporter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { i18n } from "i18next";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthInitializer } from "./components/AuthInitializer";
import config, { ConfigType } from "./config";
import { MessagesProvider } from "./containers/Messages/MessagesProvider";
import { getSessionStateFromCookie, SessionProvider } from "./containers/Session/SessionProvider";
import { isValidLocale, initializeI18n } from "./i18n";
import { routes } from "./routes";
import Formbricks from "./scripts/Formbricks";
import { getAccessToken } from "./util/authHelpers";
import { isNdlaApiError } from "./util/resolveJsonOrRejectWithError";

declare global {
  interface Window {
    h5pResizerInitialized?: boolean;
    errorReporter: any;
    config: ConfigType;
  }
}

const paths = window.location.pathname.split("/");
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : undefined;

const { logglyApiKey, logEnvironment: environment, componentName } = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
});

const i18n = initializeI18n(basename ?? config.defaultLanguage);

const MAX_RETRIES = 2;
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (failureCount > MAX_RETRIES) {
          return false;
        }
        if (isNdlaApiError(error) && HTTP_STATUS_TO_NOT_RETRY.includes(error.status)) {
          return false;
        }

        return true;
      },
    },
  },
});

const router = createBrowserRouter(routes, { basename: basename ? `/${basename}` : undefined });

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n as i18n}>
      <MessagesProvider>
        <SessionProvider initialValue={getSessionStateFromCookie(getAccessToken())}>
          <AuthInitializer>
            <RouterProvider router={router} />
          </AuthInitializer>
        </SessionProvider>
      </MessagesProvider>
    </I18nextProvider>
    <Formbricks />
    <ReactQueryDevtools />
  </QueryClientProvider>,
);
