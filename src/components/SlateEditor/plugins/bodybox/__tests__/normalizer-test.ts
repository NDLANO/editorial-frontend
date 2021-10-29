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
import { TYPE_BODYBOX } from '..';
import withPlugins from '../../../utils/withPlugins';
import { plugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/LearningResourceContent';
import { TYPE_SECTION } from '../../section';
import { TYPE_HEADING } from '../../heading';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('bodybox normalizer tests', () => {
  test('adds paragraphs around bodybox element', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_BODYBOX,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
          },
          {
            type: TYPE_BODYBOX,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
          },
          {
            type: TYPE_BODYBOX,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
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
            type: TYPE_BODYBOX,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_BODYBOX,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_BODYBOX,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('adds paragraph to empty bodybox element', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_BODYBOX,
            children: [],
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
            type: TYPE_BODYBOX,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: '' }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('adds paragraph at the end of bodybox with only heading', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_BODYBOX,
            children: [{ type: TYPE_HEADING, level: 1, children: [{ text: 'content' }] }],
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
            type: TYPE_BODYBOX,
            children: [
              { type: TYPE_HEADING, level: 1, children: [{ text: 'content' }] },
              { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('unwraps content of wrong type', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_BODYBOX,
            children: [
              {
                type: TYPE_BODYBOX,
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
              },
            ],
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
            type: TYPE_BODYBOX,
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
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
