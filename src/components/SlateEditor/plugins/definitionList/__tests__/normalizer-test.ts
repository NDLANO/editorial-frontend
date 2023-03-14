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
import { definitionList } from '../utils/defaultBlocks';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from '../types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_PARAGRAPH } from '../../paragraph/types';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('definition normalizing tests', () => {
  test('expect list with 1 definition pair not to change', () => {
    const editorValue: Descendant[] = [definitionList];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });

    expect(editor.children).toEqual(editorValue);
  });

  test('expect list to create missing description objects', () => {
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

  test('expect list to create missing term objects', () => {
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

  test('expect two definition lists after eachother to merge', () => {
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

  test('If definition list is empty, add term and description', () => {
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
