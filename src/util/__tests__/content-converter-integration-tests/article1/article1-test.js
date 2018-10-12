/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import jsdom from 'jsdom';
import prettier from 'prettier';

import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../articleContentConverter';
import { html } from './article1';

const { fragment } = jsdom.JSDOM;

// Use prettier to format html for better diffing. N.B. prettier html formating is currently experimental
export const prettify = content =>
  prettier.format(`${content}`, { parser: 'parse5' });

test('serializing article 1', () => {
  const converted = learningResourceContentToEditorValue(html, fragment);

  const result = learningResourceContentToHTML(converted);

  expect(prettify(result)).toMatchSnapshot();
});
