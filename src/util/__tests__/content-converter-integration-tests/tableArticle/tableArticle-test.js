/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import jsdom from 'jsdom';
import prettify from '../prettify';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../articleContentConverter';
import { html } from './tableArticle';

const { fragment } = jsdom.JSDOM;

test('serializing article with table tag and attributes', () => {
  const converted = learningResourceContentToEditorValue(html, fragment);

  const result = learningResourceContentToHTML(converted);

  expect(prettify(result)).toMatchSnapshot();
});
