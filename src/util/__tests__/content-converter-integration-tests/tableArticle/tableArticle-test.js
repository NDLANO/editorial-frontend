/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import filterConsole from "filter-console";
import { html } from "./tableArticle";
import { blockContentToEditorValue, blockContentToHTML } from "../../../articleContentConverter";

let disableFilter;
beforeEach(() => {
  // colspan is valid html. We can safely ignore this warning from react.
  disableFilter = filterConsole(["Warning: Invalid DOM property `colspan`. Did you mean `colSpan`?"]);
});

afterEach(() => {
  disableFilter();
});

test("serializing article with table tag and attributes", () => {
  const converted = blockContentToEditorValue(html);

  const result = blockContentToHTML(converted);

  expect(global.prettifyHTML(result)).toMatchSnapshot();
});
