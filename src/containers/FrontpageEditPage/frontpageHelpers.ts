/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { keyBy } from "lodash-es";
import { IArticleSummaryV2DTO, ISearchResultV2DTO } from "@ndla/types-backend/article-api";
import { IFrontPageDTO, IMenuDTO } from "@ndla/types-backend/frontpage-api";
import { MenuWithArticle } from "./types";

export const extractArticleIds = (menu: MenuWithArticle): number[] => {
  const childIds = menu.menu.map((m) => extractArticleIds(m)).flat();
  return [menu.articleId].concat(childIds);
};

const _addArticlesToMenu = (menu: IMenuDTO, articles: Record<number, IArticleSummaryV2DTO>): MenuWithArticle => {
  const article = articles[menu.articleId];
  const children = menu.menu.map((m) => _addArticlesToMenu(m, articles));
  return { article: article, articleId: menu.articleId, menu: children };
};

export const addArticlesToAboutMenu = (frontPage: IFrontPageDTO | undefined, articles: ISearchResultV2DTO) => {
  if (!frontPage) return { articleId: -1, menu: [] };
  const keyedArticles = keyBy(articles.results, (a) => a.id);
  const menuWithArticles = frontPage.menu.map((m) => _addArticlesToMenu(m, keyedArticles));
  return {
    ...frontPage,
    menu: menuWithArticles,
  };
};

const _menuWithArticleToIMenu = (menu: MenuWithArticle): IMenuDTO => {
  const children = menu.menu.map((m) => _menuWithArticleToIMenu(m));
  return { articleId: menu.articleId, menu: children };
};

export const menuWithArticleToIMenu = (menu: MenuWithArticle): IFrontPageDTO => {
  return {
    articleId: typeof menu.article === "number" ? menu.article : menu.articleId,
    menu: menu.menu.map((m) => _menuWithArticleToIMenu(m)),
  };
};
