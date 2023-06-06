/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

const FrontpageArticleContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>] | undefined
>(undefined);

interface Props {
  children: ReactNode;
  initialValue?: boolean;
}

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

  const toggleFrontpageArticle = (articleId: number) => {
    const frontpageArticleIds = getArticleIdList();

    if (frontpageArticleIds.includes(articleId)) {
      updateFrontpageArticleList(frontpageArticleIds.filter((value) => value !== articleId));
      setFrontpageArticle(false);
    } else {
      updateFrontpageArticleList([...frontpageArticleIds, articleId]);
      setFrontpageArticle(true);
    }
  };

  const articleIsFrontpageArticle = (articleId: number) => getArticleIdList().includes(articleId);

  return {
    isFrontpageArticle,
    toggleFrontpageArticle,
    articleIsFrontpageArticle,
    setFrontpageArticle,
  };
};

const getArticleIdList = () =>
  isNumberArray(JSON.parse(localStorage.getItem('frontpage-articles') ?? '[]'))
    .filter(Number)
    .map(Number);

const updateFrontpageArticleList = (articles: number[]) =>
  localStorage.setItem('frontpage-articles', JSON.stringify(articles));

const isNumberArray = (value: any): string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number') ? value : [];
