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
import { TYPE_FOOTNOTE } from '../types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_PARAGRAPH,
        children: [
          {
            text: 'text',
          },
          {
            type: TYPE_FOOTNOTE,
            data: {
              title: 'test-title',
              year: '2000',
              resource: 'footnote',
              authors: ['test'],
              edition: '1',
              publisher: 'test-publisher',
              type: '',
            },
            children: [
              {
                text: '[#]',
              },
            ],
          },
          { text: '' },
        ],
      },
    ],
  },
];

const html =
  '<section><p>text<embed data-title="test-title" data-year="2000" data-resource="footnote" data-authors="test" data-edition="1" data-publisher="test-publisher" data-type=""/></p></section>';
describe('file serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
