/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import {
  blockContentToEditorValue,
  blockContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_KEY_PERFORMANCE_INDICATOR } from '../types';

const html =
  '<section><ndlaembed data-resource="key-performance-indicator" data-image-id="65790" data-title="Her erre en test folkens" data-sub-title="Her erre en test folkens" data-language="nb"></ndlaembed></section>';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      {
        type: TYPE_KEY_PERFORMANCE_INDICATOR,
        data: {
          resource: 'key-performance-indicator',
          imageId: '65790',
          title: 'Her erre en test folkens',
          subTitle: 'Her erre en test folkens',
          language: 'nb',
        },
        children: [],
      },
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
    ],
  },
];

describe('key performance indicator serializing tests', () => {
  test('serializing', () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
