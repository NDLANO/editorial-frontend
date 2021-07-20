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
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import { withPlugins } from '../../../RichTextEditor';
import { plugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/LearningResourceContent';
import { TYPE_SECTION } from '../../section';
import { TYPE_EMBED } from '..';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('embed normalizer tests', () => {
  test('adds paragraphs around embed', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_EMBED,
            children: [
              {
                text: '',
              },
            ],
            data: {
              resource: 'image',
            },
          },
          {
            type: TYPE_EMBED,
            children: [
              {
                text: '',
              },
            ],
            data: {
              resource: 'h5p',
            },
          },
          {
            type: TYPE_EMBED,
            children: [
              {
                text: '',
              },
            ],
            data: {
              resource: 'audio',
            },
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
            type: TYPE_EMBED,
            children: [
              {
                text: '',
              },
            ],
            data: {
              resource: 'image',
            },
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_EMBED,
            children: [
              {
                text: '',
              },
            ],
            data: {
              resource: 'h5p',
            },
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_EMBED,
            children: [
              {
                text: '',
              },
            ],
            data: {
              resource: 'audio',
            },
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
