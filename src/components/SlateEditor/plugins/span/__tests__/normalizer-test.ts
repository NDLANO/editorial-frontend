/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEditor, Descendant, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import withPlugins from '../../../utils/withPlugins';
import { plugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/LearningResourceContent';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_SPAN } from '../types';

const editor = withHistory(
  withReact(
    withPlugins(
      createEditor(),
      plugins('nb', () => {}),
    ),
  ),
);

describe('span normalizer tests', () => {
  test('Span with language remains after normalization', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: '' },
              { type: TYPE_SPAN, data: { lang: 'en' }, children: [{ text: 'test' }] },
              { text: '' },
            ],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: '' },
              { type: TYPE_SPAN, data: { lang: 'en' }, children: [{ text: 'test' }] },
              { text: '' },
            ],
          },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
