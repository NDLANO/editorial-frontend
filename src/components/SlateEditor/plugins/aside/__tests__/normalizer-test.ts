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
import { TYPE_HEADING } from '../../heading/types';
import { TYPE_LINK } from '../../link/types';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_ASIDE } from '../types';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('aside normalizer tests', () => {
  test('adds paragraphs around aside element', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_ASIDE,
            data: { type: 'factAside' },
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
          },
          {
            type: TYPE_ASIDE,
            data: { type: 'rightAside' },
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
          },
          {
            type: TYPE_ASIDE,
            data: { type: 'rightAside' },
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
            type: TYPE_ASIDE,
            data: { type: 'factAside' },
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_ASIDE,
            data: { type: 'rightAside' },
            children: [{ type: TYPE_PARAGRAPH, children: [{ text: 'content' }] }],
          },
          { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
          {
            type: TYPE_ASIDE,
            data: { type: 'rightAside' },
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

  test('adds paragraphs to empty aside element', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_ASIDE,
            data: { type: 'factAside' },
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
            type: TYPE_ASIDE,
            data: { type: 'factAside' },
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

  test('adds paragraph at the end of aside with only heading', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_ASIDE,
            data: { type: 'factAside' },
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
            type: TYPE_ASIDE,
            data: { type: 'factAside' },
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
            type: TYPE_ASIDE,
            data: { type: 'factAside' },
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
            type: TYPE_ASIDE,
            data: { type: 'factAside' },
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
