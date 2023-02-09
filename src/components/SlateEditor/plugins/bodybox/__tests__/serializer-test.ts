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
import { TYPE_BODYBOX } from '../types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      {
        type: TYPE_BODYBOX,
        children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
      },
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
    ],
  },
];

const html = '<section><div class="c-bodybox"><p>content</p></div></section>';

describe('bodybox serializing tests', () => {
  test('serializing', () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
