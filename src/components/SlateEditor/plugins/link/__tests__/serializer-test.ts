/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { TYPE_SECTION } from '../../section';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import { TYPE_LINK, TYPE_CONTENT_LINK } from '..';

const editor: Descendant[][] = [
  [
    {
      type: TYPE_SECTION,
      children: [
        {
          type: TYPE_PARAGRAPH,
          children: [
            {
              type: TYPE_LINK,
              href: 'http://test.url/',
              rel: undefined,
              target: undefined,
              title: undefined,
              children: [
                {
                  text: 'link',
                },
              ],
            },
          ],
        },
        {
          type: TYPE_PARAGRAPH,
          children: [
            {
              type: TYPE_CONTENT_LINK,
              'content-id': '123',
              'content-type': 'article',
              'open-in': 'new-context',
              children: [
                {
                  text: 'content-link',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
];

const html =
  '<section><p><a href="http://test.url/">link</a></p><p><embed data-content-id="123" data-link-text="content-link" data-open-in="new-context" data-resource="content-link" data-content-type="article"/></p></section>';
describe('link serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
