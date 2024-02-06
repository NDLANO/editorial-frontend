/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IMenu } from "@ndla/types-backend/frontpage-api";
import { extractArticleIds } from "../frontpageHelpers";
describe("extractArticleIds", () => {
  it("should return a single value for a menu with no children", () => {
    const menu: IMenu = {
      articleId: 1,
      hideLevel: false,
      menu: [],
      hideLevel: false,
    };
    expect(extractArticleIds(menu)).toEqual([1]);
  });
  it("should handle nested values", () => {
    const menu: IMenu = {
      articleId: 1,
      hideLevel: false,
      menu: [
        {
          articleId: 2,
          hideLevel: false,
          menu: [],
          hideLevel: false,
        },
        {
          articleId: 3,
          hideLevel: false,
          menu: [],
          hideLevel: false,
        },
      ],
      hideLevel: false,
    };
    expect(extractArticleIds(menu)).toEqual([1, 2, 3]);
  });
  it("should handle deeply nested values", () => {
    const menu: IMenu = {
      articleId: 1,
      hideLevel: false,
      menu: [
        {
          articleId: 2,
          hideLevel: false,
          menu: [
            {
              articleId: 3,
              hideLevel: false,
              menu: [
                { articleId: 4, hideLevel: false, menu: [] },
                { articleId: 5, hideLevel: false, menu: [] },
              ],
              hideLevel: false,
            },
          ],
          hideLevel: false,
        },
        {
          articleId: 6,
          hideLevel: false,
          menu: [
            {
              articleId: 7,
              hideLevel: false,
              menu: [],
              hideLevel: false,
            },
            {
              articleId: 8,
              hideLevel: false,
              menu: [
                { articleId: 9, hideLevel: false, menu: [] },
                { articleId: 10, hideLevel: false, menu: [] },
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
