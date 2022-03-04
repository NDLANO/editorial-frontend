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
import { TYPE_FILE } from '../types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      {
        type: TYPE_FILE,
        data: [
          {
            resource: 'file',
            path: '/files/resources/file1.txt',
            type: 'txt',
            title: 'test_txt',
            url: 'https://api.test.ndla.no/files/resources/file1.txt',
          },
          {
            path: '/files/resources/file2.pdf',
            type: 'pdf',
            title: 'test_pdf2',
            resource: 'file',
            url: 'https://api.test.ndla.no/files/resources/file2.pdf',
          },
          {
            path: '/files/resources/file3.pdf',
            type: 'pdf',
            title: 'test_pdf3',
            resource: 'file',
            display: 'block',
            url: 'https://api.test.ndla.no/files/resources/file3.pdf',
          },
        ],
        children: [{ text: '' }],
      },
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
    ],
  },
];

const html =
  '<section><div data-type="file"><embed data-resource="file" data-path="/files/resources/file1.txt" data-type="txt" data-title="test_txt" data-url="https://api.test.ndla.no/files/resources/file1.txt"/><embed data-path="/files/resources/file2.pdf" data-type="pdf" data-title="test_pdf2" data-resource="file" data-url="https://api.test.ndla.no/files/resources/file2.pdf"/><embed data-path="/files/resources/file3.pdf" data-type="pdf" data-title="test_pdf3" data-resource="file" data-display="block" data-url="https://api.test.ndla.no/files/resources/file3.pdf"/></div></section>';

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
