/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18nInstance } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import IntlProvider from '@ndla/i18n';
import { initializeI18n } from '../../i18n2';
import { getLocaleObject } from '../../i18n';

const InitI18nWrapper = ({ children }) => {
  const { i18n } = useTranslation();
  initializeI18n(i18n);
  i18n.language = 'nb';
  return (
    <IntlProvider locale={i18n.language} messages={getLocaleObject(i18n.language).messages}>
      {children}
    </IntlProvider>
  );
};

const IntlWrapper = ({ children }) => (
  <I18nextProvider i18n={i18nInstance}>
    <InitI18nWrapper>{children}</InitI18nWrapper>
  </I18nextProvider>
);
export default IntlWrapper;
