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

import { learningResourcePlugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins';
import withPlugins from '../../../utils/withPlugins';
import { TYPE_HEADING } from '../../heading/types';
import { TYPE_LINK } from '../../link/types';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_BODYBOX } from '../types';

const editor = withHistory(withReact(withPlugins(createEditor(), learningResourcePlugins)));

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
                type: TYPE_LINK,
                href: 'testurl',
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
