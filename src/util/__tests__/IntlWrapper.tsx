/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { i18nInstance } from "@ndla/ui";
import { initializeI18n } from "../../i18n";

const InitI18nWrapper = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  initializeI18n(i18n);
  i18n.language = "nb";
  return children;
};

const IntlWrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18nInstance}>
    <InitI18nWrapper>{children}</InitI18nWrapper>
  </I18nextProvider>
);
export default IntlWrapper;
