/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { i18n } from "i18next";
import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { initializeI18n } from "../../i18n";

const IntlWrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={initializeI18n("nb") as i18n}>{children}</I18nextProvider>
);
export default IntlWrapper;
