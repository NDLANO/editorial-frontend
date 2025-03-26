/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getTaxonomyPathsFromTaxonomy } from "../util";

test("that getTaxonomyPathsFromTaxonomy finds correct paths from object with id", () => {
  const result = getTaxonomyPathsFromTaxonomy(
    [
      {
        paths: ["/subject:1/topic:1/topic:456", "/subject:1/topic:2/topic:456"],
      },
      {
        paths: ["/subject:2/topic:3"],
      },
      {
        paths: [],
      },
    ],
    1,
  );

  expect(result).toStrictEqual([
    "/subject:1/topic:1/topic:456",
    "/subject:1/topic:2/topic:456",
    "/subject:2/topic:3",
    "/article/1",
  ]);
});

test("that getTaxonomyPathsFromTaxonomy finds correct paths from object without id", () => {
  const result = getTaxonomyPathsFromTaxonomy([
    {
      paths: ["/subject:1/topic:1/topic:2/resource:1"],
    },
  ]);

  expect(result).toStrictEqual(["/subject:1/topic:1/topic:2/resource:1"]);
});
