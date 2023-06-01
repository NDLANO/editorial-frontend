/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEditor, Descendant, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { plugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/LearningResourceContent';
import withPlugins from '../../../utils/withPlugins';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from '../types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_PARAGRAPH } from '../../paragraph/types';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('definition normalizing tests', () => {
  test('should create missing description objects', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_DEFINTION_LIST,
        children: [
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_DEFINTION_LIST,
        children: [
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('should create missing term objects', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_DEFINTION_LIST,
        children: [
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_DEFINTION_LIST,
        children: [
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
          { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
        ],
      },
    ];
    editor.children = editorValue;

    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('should merge definition lists that comes after eachother', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_DEFINTION_LIST,
            children: [
              { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
              { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
            ],
          },
          {
            type: TYPE_DEFINTION_LIST,
            children: [
              { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
              { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
            ],
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
    expect(editor.children).toEqual([
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_DEFINTION_LIST,
            children: [
              { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
              { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
              { type: TYPE_DEFINTION_TERM, children: [{ text: '' }] },
              { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
            ],
          },
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ]);
  });

  test('should add term and description in empty description list', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
          {
            type: TYPE_DEFINTION_LIST,
            children: [],
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
            type: TYPE_DEFINTION_LIST,
            children: [
              { type: TYPE_DEFINTION_TERM, children: [] },
              { type: TYPE_DEFINTION_DESCRIPTION, children: [{ text: '' }] },
            ],
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
