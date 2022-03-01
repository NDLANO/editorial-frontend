/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import {
  topicArticleContentToEditorValue,
  topicArticleContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_EMBED } from '../../embed/types';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      {
        type: TYPE_EMBED,
        children: [
          {
            text: '',
          },
        ],
        data: {
          align: ' ',
          alt: ' ',
          caption: ' ',
          resource: 'image',
          resource_id: '41176',
          size: 'fullbredde',
          url: 'https://test123.no',
        },
      },
      { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
    ],
  },
];

describe('embed serializing tests', () => {
  test('serializing', () => {
    const emptySectionHtml = '<section></section>';

    const res = topicArticleContentToHTML(editor);
    expect(res).toMatch(emptySectionHtml);
  });

  test('deserializing', () => {
    const embedHtml =
      '<section><embed data-resource="image" data-resource_id="41176" data-size="fullbredde" data-align=" " data-alt=" " data-caption=" " data-url="https://test123.no"></section>';

    const res = topicArticleContentToEditorValue(embedHtml);
    expect(res).toEqual(editor);
  });
});
