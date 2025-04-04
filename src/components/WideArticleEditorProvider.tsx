/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState } from "react";

const WideArticleContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>] | undefined>([
  false,
  (val) => val,
]);

interface Props {
  children: ReactNode;
  initialValue?: boolean;
}

export const articleIsWide = (draftId: number) => getArticleIdList().includes(draftId);

export const WideArticleEditorProvider = ({ children, initialValue = false }: Props) => {
  const isWide = useState<boolean>(initialValue);
  return <WideArticleContext value={isWide}>{children}</WideArticleContext>;
};

export const useWideArticle = () => {
  const context = useContext(WideArticleContext);

  if (context === undefined) {
    throw new Error("useFrontpageArticle can only be used within a FrontpageArticleContext");
  }

  const [isWideArticle, setWideArticle] = context;

  const toggleWideArticles = useCallback(
    (articleId: number) => {
      const wideArticleIds = getArticleIdList();

      if (wideArticleIds.includes(articleId)) {
        updateFrontpageArticleList(wideArticleIds.filter((value) => value !== articleId));
        setWideArticle(false);
      } else {
        updateFrontpageArticleList(wideArticleIds.concat([articleId]));
        setWideArticle(true);
      }
    },
    [setWideArticle],
  );

  return {
    isWideArticle,
    setWideArticle,
    toggleWideArticles,
  };
};

const getArticleIdList: () => number[] = () =>
  JSON.parse(localStorage.getItem("wide-articles") ?? "[]")
    .filter(Number)
    .map(Number);

const updateFrontpageArticleList = (articles: number[]) =>
  localStorage.setItem("wide-articles", JSON.stringify(articles));
