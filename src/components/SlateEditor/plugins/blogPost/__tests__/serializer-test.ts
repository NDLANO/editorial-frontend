/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_BLOGPOST } from '../types';
import {
  blockContentToEditorValue,
  blockContentToHTML,
} from '../../../../../util/articleContentConverter';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_BLOGPOST,
        data: {
          resource: 'blog-post',
          imageId: '123',
          language: 'nb',
          title: 'Min bloggpost',
          size: 'large',
          author: 'Ola Nordmann',
          url: 'https://ndla.no',
        },
        children: [{ text: '' }],
      },
    ],
  },
];

const html =
  '<section><ndlaembed data-resource="blog-post" data-image-id="123" data-language="nb" data-title="Min bloggpost" data-size="large" data-author="Ola Nordmann" data-url="https://ndla.no"></ndlaembed></section>';

describe('blogPost serializing tests', () => {
  test('serializing', () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});