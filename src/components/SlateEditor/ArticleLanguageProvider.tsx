/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, createContext, useContext } from "react";
import config from "../../config";

const ArticleLanguageContext = createContext<string>(config.defaultLanguage);

interface Props {
  language?: string;
  children?: ReactNode;
}

export const ArticleLanguageProvider = ({ language, children }: Props) => (
  <ArticleLanguageContext value={language ?? config.defaultLanguage}>{children}</ArticleLanguageContext>
);

export const useArticleLanguage = () => {
  const context = useContext(ArticleLanguageContext);
  return context;
};
