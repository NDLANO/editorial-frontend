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
import { TYPE_CODEBLOCK } from '../types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      {
        type: TYPE_CODEBLOCK,
        data: {
          'code-content': 'print(1)',
          'code-format': 'python',
          resource: 'code-block',
          title: 'tittel',
        },
        children: [{ text: '' }],
        isFirstEdit: false,
      },
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
    ],
  },
];

const html =
  '<section><embed data-resource="code-block" data-code-content="print(1)" data-code-format="python" data-title="tittel"/></section>';

describe('codeblock serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
