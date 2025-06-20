/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IMenuDTO } from "@ndla/types-backend/frontpage-api";
import { extractArticleIds } from "../frontpageHelpers";
describe("extractArticleIds", () => {
  it("should return a single value for a menu with no children", () => {
    const menu: IMenuDTO = {
      articleId: 1,
      menu: [],
    };
    expect(extractArticleIds(menu)).toEqual([1]);
  });
  it("should handle nested values", () => {
    const menu: IMenuDTO = {
      articleId: 1,
      menu: [
        {
          articleId: 2,
          menu: [],
        },
        {
          articleId: 3,
          menu: [],
        },
      ],
    };
    expect(extractArticleIds(menu)).toEqual([1, 2, 3]);
  });
  it("should handle deeply nested values", () => {
    const menu: IMenuDTO = {
      articleId: 1,
      menu: [
        {
          articleId: 2,
          menu: [
            {
              articleId: 3,
              menu: [
                { articleId: 4, menu: [] },
                { articleId: 5, menu: [] },
              ],
            },
          ],
        },
        {
          articleId: 6,
          menu: [
            {
              articleId: 7,
              menu: [],
            },
            {
              articleId: 8,

              menu: [
                { articleId: 9, menu: [] },
                { articleId: 10, menu: [] },
              ],
            },
          ],
        },
      ],
    };
    expect(extractArticleIds(menu)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
