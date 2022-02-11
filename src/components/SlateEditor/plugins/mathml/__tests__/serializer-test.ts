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
import { TYPE_MATHML } from '..';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        children: [
          { text: '' },
          {
            type: TYPE_MATHML,
            data: {
              innerHTML:
                '<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>1</mn><mn>2</mn></mfrac></math>',
            },
            children: [
              {
                text: '12',
              },
            ],
          },
          { text: '' },
        ],
        type: TYPE_PARAGRAPH,
      },
    ],
  },
];

const html =
  '<section><p><math><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>1</mn><mn>2</mn></mfrac></math></math></p></section>';

describe('mathml serializing tests', () => {
  test('serializing', () => {
    const res = learningResourceContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(html);
    expect(res).toMatchObject(editor);
  });
});
