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
      hideLevel: false,
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
          hideLevel: false,
        },
        {
          articleId: 3,
          menu: [],
          hideLevel: false,
        },
      ],
      hideLevel: false,
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
                { articleId: 4, menu: [], hideLevel: false },
                { articleId: 5, menu: [], hideLevel: false },
              ],
              hideLevel: false,
            },
          ],
          hideLevel: false,
        },
        {
          articleId: 6,
          menu: [
            {
              articleId: 7,
              menu: [],
              hideLevel: false,
            },
            {
              articleId: 8,

              menu: [
                { articleId: 9, menu: [], hideLevel: false },
                { articleId: 10, menu: [], hideLevel: false },
              ],
              hideLevel: false,
            },
          ],
          hideLevel: false,
        },
      ],
      hideLevel: false,
    };
    expect(extractArticleIds(menu)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
