/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode, createContext, useContext } from "react";
import { IArticleDTO } from "@ndla/types-backend/draft-api";

const IsNewArticleLanguageContext = createContext<boolean>(false);

interface Props {
  locale: string;
  article?: IArticleDTO;
  children?: ReactNode;
}

export const IsNewArticleLanguageProvider = ({ locale, article, children }: Props) => {
  const value = isNewArticleLanguage(locale, article);
  return <IsNewArticleLanguageContext.Provider value={value}>{children}</IsNewArticleLanguageContext.Provider>;
};

export const useIsNewArticleLanguage = () => {
  const context = useContext(IsNewArticleLanguageContext);
  return context;
};

export const isNewArticleLanguage = (locale: string, article?: IArticleDTO) => {
  return !article?.supportedLanguages.includes(locale);
};
