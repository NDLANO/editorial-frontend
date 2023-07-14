/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

const FrontpageArticleContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>] | undefined
>([false, (val) => val]);

interface Props {
  children: ReactNode;
  initialValue?: boolean;
}

export const articleIsWide = (draftId: number) => getArticleIdList().includes(draftId);

export const FrontpageArticleProvider = ({ children, initialValue = false }: Props) => {
  const isFrontpageArticle = useState<boolean>(initialValue);
  return (
    <FrontpageArticleContext.Provider value={isFrontpageArticle}>
      {children}
    </FrontpageArticleContext.Provider>
  );
};

export const useFrontpageArticle = () => {
  const context = useContext(FrontpageArticleContext);

  if (context === undefined) {
    throw new Error('useFrontpageArticle can only be used within a FrontpageArticleContext');
  }

  const [isFrontpageArticle, setFrontpageArticle] = context;

  const toggleFrontpageArticle = useCallback(
    (articleId: number) => {
      const frontpageArticleIds = getArticleIdList();

      if (frontpageArticleIds.includes(articleId)) {
        updateFrontpageArticleList(frontpageArticleIds.filter((value) => value !== articleId));
        setFrontpageArticle(false);
      } else {
        updateFrontpageArticleList(frontpageArticleIds.concat([articleId]));
        setFrontpageArticle(true);
      }
    },
    [setFrontpageArticle],
  );

  return {
    isFrontpageArticle,
    toggleFrontpageArticle,
    setFrontpageArticle,
  };
};

const getArticleIdList: () => number[] = () =>
  JSON.parse(localStorage.getItem('wide-articles') ?? '[]')
    .filter(Number)
    .map(Number);

const updateFrontpageArticleList = (articles: number[]) =>
  localStorage.setItem('wide-articles', JSON.stringify(articles));
