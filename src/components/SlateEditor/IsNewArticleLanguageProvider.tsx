/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode, createContext, useContext } from "react";
import { IArticle } from "@ndla/types-backend/draft-api";

const IsNewArticleLanguageContext = createContext<boolean>(false);

interface Props {
  isNewArticleLanguage: boolean;
  children?: ReactNode;
}

export const IsNewArticleLanguageProvider = ({ isNewArticleLanguage, children }: Props) => (
  <IsNewArticleLanguageContext.Provider value={isNewArticleLanguage}>{children}</IsNewArticleLanguageContext.Provider>
);

export const useIsNewArticleLanguage = () => {
  const context = useContext(IsNewArticleLanguageContext);
  return context;
};

export const isNewArticleLanguage = (locale: string, article?: IArticle) => {
  if (locale === "nn" && article?.content?.language !== "nn") return true;
  if (locale === "nb" && article?.content?.language !== "nb") return true;
  return false;
};
