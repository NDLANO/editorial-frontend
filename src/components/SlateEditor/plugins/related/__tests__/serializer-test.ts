/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_RELATED } from '../types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      {
        type: TYPE_RELATED,
        data: {
          nodes: [
            {
              resource: 'related-content',
              'article-id': '123',
            },
            {
              resource: 'related-content',
              url: 'http://google.com',
              title: 'test-title',
            },
          ],
        },
        children: [
          {
            text: '',
          },
        ],
      },
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
    ],
  },
];

const html =
  '<section><div data-type="related-content"><embed data-resource="related-content" data-article-id="123"/><embed data-resource="related-content" data-url="http://google.com" data-title="test-title"/></div></section>';

describe('related serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
