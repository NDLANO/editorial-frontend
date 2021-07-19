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
import { TYPE_CONCEPT } from '..';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';

const editor: Descendant[][] = [
  [
    {
      type: TYPE_SECTION,
      children: [
        {
          type: TYPE_PARAGRAPH,
          children: [
            {
              type: TYPE_CONCEPT,
              data: {
                'content-id': '123',
                'link-text': 'my concept',
                resource: 'concept',
                type: 'inline',
              },
              children: [{ text: 'my concept' }],
            },
          ],
        },
      ],
    },
  ],
];

const html =
  '<section><p><embed data-content-id="123" data-link-text="my concept" data-resource="concept" data-type="inline"/></p></section>';

describe('concept serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
