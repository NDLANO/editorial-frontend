/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import jsdom from 'jsdom';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../articleContentConverter';
import { html } from './mixedArticle';

const { fragment } = jsdom.JSDOM;

test('serializing article with many diffrent tags and embeds', () => {
  const converted = learningResourceContentToEditorValue(html, fragment);

  const result = learningResourceContentToHTML(converted);

  expect(global.prettifyHTML(result)).toMatchSnapshot();
});
