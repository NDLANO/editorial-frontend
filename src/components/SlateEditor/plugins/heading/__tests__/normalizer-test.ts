/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEditor, Descendant, Editor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import withPlugins from '../../../utils/withPlugins';
import { plugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/LearningResourceContent';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_HEADING } from '../types';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('heading normalizer tests', () => {
  test('unwrap empty header if not selected', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_HEADING,
            level: 2,
            children: [{ text: '' }],
          },
          {
            type: TYPE_HEADING,
            level: 3,
            children: [{ text: 'not empty' }],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
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
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_HEADING,
            level: 3,
            children: [{ text: 'not empty' }],
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

  test('dont remove empty header if selected', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_HEADING,
            level: 2,
            children: [{ text: '' }],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
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
            type: TYPE_HEADING,
            level: 2,
            children: [{ text: '' }],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];
    editor.children = editorValue;
    Transforms.select(editor, [0, 1, 0]);
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
