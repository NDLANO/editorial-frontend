/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { html } from "./supArticle";
import { blockContentToEditorValue, blockContentToHTML } from "../../../articleContentConverter";

test("serializing article with sup tag", () => {
  const converted = blockContentToEditorValue(html);

  const result = blockContentToHTML(converted);

  expect(global.prettifyHTML(result)).toMatchSnapshot();
});
