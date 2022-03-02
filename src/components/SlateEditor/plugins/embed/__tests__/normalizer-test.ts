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
import { TYPE_EMBED } from '../types';

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
              resource_id: '123',
              size: 'small',
              align: 'right',
              alt: 'test-alt',
              caption: 'test-caption',
              url: 'https://test.url',
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
              url: 'https://test.url',
              path: 'test/path',
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
              resource_id: '123',
              type: 'standard',
              url: 'https://test.url',
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
              resource_id: '123',
              size: 'small',
              align: 'right',
              alt: 'test-alt',
              caption: 'test-caption',
              url: 'https://test.url',
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
              url: 'https://test.url',
              path: 'test/path',
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
              resource_id: '123',
              type: 'standard',
              url: 'https://test.url',
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
