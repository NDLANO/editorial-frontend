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
import { TYPE_CODEBLOCK } from '../types';

const editor = withHistory(
  withReact(
    withPlugins(
      createEditor(),
      plugins('nb', 'nb', () => {}),
    ),
  ),
);

describe('codeblock normalizer tests', () => {
  test('adds paragraphs around codeblock', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_CODEBLOCK,
            data: {
              codeContent: 'print(1)',
              codeFormat: 'python',
              resource: 'code-block',
              title: 'tittel',
            },
            children: [{ text: '' }],
            isFirstEdit: false,
          },
          {
            type: TYPE_CODEBLOCK,
            data: {
              codeContent: 'print(1)',
              codeFormat: 'python',
              resource: 'code-block',
              title: 'tittel',
            },
            children: [{ text: '' }],
            isFirstEdit: false,
          },
          {
            type: TYPE_CODEBLOCK,
            data: {
              codeContent: 'print(1)',
              codeFormat: 'python',
              resource: 'code-block',
              title: 'tittel',
            },
            children: [{ text: '' }],
            isFirstEdit: false,
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_CODEBLOCK,
            data: {
              codeContent: 'print(1)',
              codeFormat: 'python',
              resource: 'code-block',
              title: 'tittel',
            },
            children: [{ text: '' }],
            isFirstEdit: false,
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_CODEBLOCK,
            data: {
              codeContent: 'print(1)',
              codeFormat: 'python',
              resource: 'code-block',
              title: 'tittel',
            },
            children: [{ text: '' }],
            isFirstEdit: false,
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_CODEBLOCK,
            data: {
              codeContent: 'print(1)',
              codeFormat: 'python',
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
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
