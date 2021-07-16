/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { TYPE_SECTION } from '../../section';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_EMBED } from '..';

describe('embed image serializing tests', () => {
  const editorWithImage: Descendant[][] = [
    [
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
        ],
      },
    ],
  ];

  const htmlWithImage =
    '<section><embed data-resource="image" data-resource_id="123" data-size="small" data-align="right" data-alt="test-alt" data-caption="test-caption" data-url="https://test.url"/></section>';

  test('serializing image', () => {
    const res = learningResourceContentToHTML(editorWithImage);
    expect(res).toMatch(htmlWithImage);
  });

  test('deserializing image', () => {
    const res = learningResourceContentToEditorValue(htmlWithImage);
    expect(res).toEqual(editorWithImage);
  });
});

describe('embed brightcove video serializing tests', () => {
  const editorWithBrightcove: Descendant[][] = [
    [
      {
        children: [
          {
            type: 'embed',
            data: {
              resource: 'brightcove',
              videoid: '123',
              caption: 'test caption',
              account: '1000',
              player: 'abc',
              title: 'test title',
            },
            children: [
              {
                text: '',
              },
            ],
          },
        ],
        type: 'section',
      },
    ],
  ];
  const htmlWithBrightcove =
    '<section><embed data-resource="brightcove" data-videoid="123" data-caption="test caption" data-account="1000" data-player="abc" data-title="test title"/></section>';
  test('serializing', () => {
    const res = learningResourceContentToHTML(editorWithBrightcove);
    expect(res).toMatch(htmlWithBrightcove);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(htmlWithBrightcove);
    expect(res).toEqual(editorWithBrightcove);
  });
});

describe('embed youtube video serializing tests', () => {
  const editorWithYotube: Descendant[][] = [
    [
      {
        children: [
          {
            type: 'embed',
            data: {
              resource: 'external',
              url: 'https://www.youtube.com/watch?v=testurl',
              title: 'test title',
            },
            children: [
              {
                text: '',
              },
            ],
          },
        ],
        type: 'section',
      },
    ],
  ];
  const htmlWithYoutube =
    '<section><embed data-resource="external" data-url="https://www.youtube.com/watch?v=testurl" data-title="test title"/></section>';
  test('serializing', () => {
    const res = learningResourceContentToHTML(editorWithYotube);
    expect(res).toMatch(htmlWithYoutube);
  });

  test('deserializing', () => {
    const res = learningResourceContentToEditorValue(htmlWithYoutube);
    expect(res).toEqual(editorWithYotube);
  });
});
