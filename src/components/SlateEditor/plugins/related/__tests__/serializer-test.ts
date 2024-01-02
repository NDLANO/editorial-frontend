/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { blockContentToEditorValue, blockContentToHTML } from '../../../../../util/articleContentConverter';
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
        data: [
          {
            resource: 'related-content',
            articleId: '123',
          },
          {
            resource: 'related-content',
            url: 'http://google.com',
            title: 'test-title',
          },
        ],
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
  '<section><div data-type="related-content"><ndlaembed data-resource="related-content" data-article-id="123"></ndlaembed><ndlaembed data-resource="related-content" data-url="http://google.com" data-title="test-title"></ndlaembed></div></section>';

describe('related serializing tests', () => {
  test('serializing', () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = blockContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
