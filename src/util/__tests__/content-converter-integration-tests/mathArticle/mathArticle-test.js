/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import filterConsole from "filter-console";
import { html } from "./mathArticle";
import { blockContentToEditorValue, blockContentToHTML } from "../../../articleContentConverter";

let disableFilter;
beforeEach(() => {
  // colspan is valid html. We can safely ignore this warning from react.
  disableFilter = filterConsole([
    "Warning: Invalid DOM property `colspan`. Did you mean `colSpan`?",
    "Warning: Invalid DOM property `rowspan`. Did you mean `rowSpan`?",
  ]);
});

afterEach(() => {
  disableFilter();
});

test("serializing article with mathml tags", () => {
  const converted = blockContentToEditorValue(html);

  const result = blockContentToHTML(converted);

  expect(global.prettifyHTML(result)).toMatchSnapshot();
});
