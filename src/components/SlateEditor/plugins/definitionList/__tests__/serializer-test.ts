/**
 * Copyright (c) 2023-present, NDLA.
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
import { TYPE_SECTION } from '../../section/types';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from '../types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_DEFINTION_LIST,
        children: [
          {
            type: TYPE_DEFINTION_TERM,
            children: [{ text: 'Tester vi testesen' }],
          },
          {
            type: TYPE_DEFINTION_DESCRIPTION,
            children: [
              { text: 'En test er en test vi tester for å teste om testingen gir test resultater' },
            ],
          },
        ],
      },
    ],
  },
];

const html =
  '<section><dl><dt>Tester vi testesen</dt><dd>En test er en test vi tester for å teste om testingen gir test resultater</dd></dl></section>';

describe('definition serializing tests', () => {
  test('serializing', () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test('deserializing', () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
