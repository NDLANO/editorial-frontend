/**
 * Copyright (c) 2021-present, NDLA.
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
import { TYPE_FILE } from '../types';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('file normalizer tests', () => {
  test('adds paragraphs around file element', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_FILE,
            children: [
              {
                text: '',
              },
            ],
            data: [],
          },
          {
            type: TYPE_FILE,
            children: [
              {
                text: '',
              },
            ],
            data: [],
          },
          {
            type: TYPE_FILE,
            children: [
              {
                text: '',
              },
            ],
            data: [],
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
            children: [{ text: '' }],
          },
          {
            type: TYPE_FILE,
            children: [
              {
                text: '',
              },
            ],
            data: [],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_FILE,
            children: [
              {
                text: '',
              },
            ],
            data: [],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_FILE,
            children: [
              {
                text: '',
              },
            ],
            data: [],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
