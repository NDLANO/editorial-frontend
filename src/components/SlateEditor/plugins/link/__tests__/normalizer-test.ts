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
import { TYPE_LINK, TYPE_CONTENT_LINK } from '../types';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('link normalizer tests', () => {
  test('Remove any elements in links', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: '' },
              {
                type: TYPE_LINK,
                href: 'test-url',
                children: [
                  {
                    type: TYPE_PARAGRAPH,
                    children: [{ text: 'illegal block' }],
                  },
                ],
              },
              { text: '' },
            ],
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
            children: [
              { text: '' },
              {
                type: TYPE_LINK,
                href: 'test-url',
                children: [{ text: 'illegal block' }],
              },
              { text: '' },
            ],
          },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('Remove styling on content-link text', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: '' },
              {
                type: TYPE_CONTENT_LINK,
                'content-id': '123',
                'content-type': 'article',
                'open-in': 'current-context',
                children: [{ bold: true, italic: true, text: 'content' }],
              },
              { text: '' },
            ],
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
            children: [
              { text: '' },
              {
                type: TYPE_CONTENT_LINK,
                'content-id': '123',
                'content-type': 'article',
                'open-in': 'current-context',
                children: [{ text: 'content' }],
              },
              { text: '' },
            ],
          },
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });

  test('Remove empty links', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [
              { text: '' },
              {
                type: TYPE_LINK,
                href: 'test-url',
                children: [
                  {
                    text: '',
                  },
                ],
              },
              { text: '' },
              {
                type: TYPE_CONTENT_LINK,
                'content-type': 'test',
                'content-id': '123',
                'open-in': 'test',
                children: [
                  {
                    text: '',
                  },
                ],
              },
              { text: '' },
            ],
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
        ],
      },
    ];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
