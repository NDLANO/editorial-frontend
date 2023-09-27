/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IMultiSearchSummary, IMultiSearchResult } from '@ndla/types-backend/search-api';
import { IMenu } from '@ndla/types-backend/frontpage-api';
import keyBy from 'lodash/keyBy';
import { MenuWithArticle } from './types';

export const extractArticleIds = (menu: IMenu): number[] => {
  const childIds = menu.menu.map((m) => extractArticleIds(m)).flat();
  return [menu.articleId].concat(childIds);
};

const _addArticlesToMenu = (
  menu: IMenu,
  articles: Record<number, IMultiSearchSummary>,
): MenuWithArticle => {
  const article = articles[menu.articleId];
  const children = menu.menu.map((m) => _addArticlesToMenu(m, articles));
  return { article: article, articleId: menu.articleId, menu: children };
};

export const addArticlesToAboutMenu = (menu: IMenu | undefined, articles: IMultiSearchResult) => {
  if (!menu) return { articleId: -1, menu: [] };
  const keyedArticles = keyBy(articles.results, (a) => a.id);
  return _addArticlesToMenu(menu, keyedArticles);
};

export const menuWithArticleToIMenu = (menu: MenuWithArticle): IMenu => {
  return {
    articleId: typeof menu.article === 'number' ? menu.article : menu.articleId,
    menu: menu.menu.map((m) => menuWithArticleToIMenu(m)),
  };
};
