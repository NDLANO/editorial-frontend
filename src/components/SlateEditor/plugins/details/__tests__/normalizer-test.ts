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
import { TYPE_DETAILS, TYPE_SUMMARY } from '..';
import withPlugins from '../../../utils/withPlugins';
import { plugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/LearningResourceContent';
import { TYPE_SECTION } from '../../section';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('details normalizer tests', () => {
  test('adds paragraphs around details element', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
              { type: TYPE_PARAGRAPH, children: [{ text: 'content' }] },
            ],
          },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
              { type: TYPE_PARAGRAPH, children: [{ text: 'content' }] },
            ],
          },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
              { type: TYPE_PARAGRAPH, children: [{ text: 'content' }] },
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
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
              { type: TYPE_PARAGRAPH, children: [{ text: 'content' }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
              { type: TYPE_PARAGRAPH, children: [{ text: 'content' }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
              { type: TYPE_PARAGRAPH, children: [{ text: 'content' }] },
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

  test('adds summary and paragraph to empty details element', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_DETAILS,
            children: [],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: '' }] },
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

  test('adds paragraph at the end of details with only summary', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_DETAILS,
            children: [{ type: TYPE_SUMMARY, children: [{ text: 'title' }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
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

  test('unwraps summary and rewraps it as paragraph if placed elsewhere', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
              { type: TYPE_SUMMARY, children: [{ text: 'wrong' }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
              { type: TYPE_PARAGRAPH, children: [{ text: 'wrong' }] },
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

  test('change summary node to paragraph if not child of details element', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [{ type: TYPE_SUMMARY, children: [{ text: 'title' }] }],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'title' }] }],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('unwrap any element inside summary', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: 'upper' }] },
          {
            type: TYPE_DETAILS,
            children: [
              {
                type: TYPE_SUMMARY,
                children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'title' }] }],
              },
              { type: TYPE_PARAGRAPH, children: [{ text: 'content' }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: 'lower' }] },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          { type: TYPE_PARAGRAPH, children: [{ text: 'upper' }] },
          {
            type: TYPE_DETAILS,
            children: [
              { type: TYPE_SUMMARY, children: [{ text: 'title' }] },
              { type: TYPE_PARAGRAPH, children: [{ text: 'content' }] },
            ],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: 'lower' }] },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
