/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_EMBED } from '../types';

describe('embed image serializing tests', () => {
  const editorWithImage: Descendant[] = [
    {
      type: TYPE_SECTION,
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },

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
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      ],
    },
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
  const editorWithBrightcove: Descendant[] = [
    {
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },

        {
          type: 'embed',
          data: {
            resource: 'brightcove',
            videoid: '123',
            caption: 'test caption',
            account: '1000',
            player: 'abc',
            url: 'https://test.url',
            title: 'test title',
          },
          children: [
            {
              text: '',
            },
          ],
        },
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      ],
      type: 'section',
    },
  ];
  const htmlWithBrightcove =
    '<section><embed data-resource="brightcove" data-videoid="123" data-caption="test caption" data-account="1000" data-player="abc" data-url="https://test.url" data-title="test title"/></section>';
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
  const editorWithYotube: Descendant[] = [
    {
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },

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
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      ],
      type: 'section',
    },
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

describe('embed audio serializing tests', () => {
  const editorWithAudio: Descendant[] = [
    {
      type: TYPE_SECTION,
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },

        {
          type: TYPE_EMBED,
          data: {
            resource: 'audio',
            resource_id: '123',
            type: 'standard',
            url: 'https://test.url',
          },
          children: [
            {
              text: '',
            },
          ],
        },
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      ],
    },
  ];

  const htmlWithAudio =
    '<section><embed data-resource="audio" data-resource_id="123" data-type="standard" data-url="https://test.url"/></section>';

  test('serializing audio', () => {
    const res = learningResourceContentToHTML(editorWithAudio);
    expect(res).toMatch(htmlWithAudio);
  });

  test('deserializing audio', () => {
    const res = learningResourceContentToEditorValue(htmlWithAudio);
    expect(res).toEqual(editorWithAudio);
  });
});

describe('embed podcast serializing tests', () => {
  const editorWithPodcast: Descendant[] = [
    {
      type: TYPE_SECTION,
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },

        {
          type: TYPE_EMBED,
          data: {
            resource: 'audio',
            resource_id: '123',
            type: 'podcast',
            url: 'https://test.url',
          },
          children: [
            {
              text: '',
            },
          ],
        },
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      ],
    },
  ];

  const htmlWithPodcast =
    '<section><embed data-resource="audio" data-resource_id="123" data-type="podcast" data-url="https://test.url"/></section>';

  test('serializing podcast', () => {
    const res = learningResourceContentToHTML(editorWithPodcast);
    expect(res).toMatch(htmlWithPodcast);
  });

  test('deserializing podcast', () => {
    const res = learningResourceContentToEditorValue(htmlWithPodcast);
    expect(res).toEqual(editorWithPodcast);
  });
});

describe('embed h5p serializing tests', () => {
  const editorWithH5P: Descendant[] = [
    {
      type: TYPE_SECTION,
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },

        {
          type: TYPE_EMBED,
          data: {
            resource: 'h5p',
            path: '/resource/123',
            url: 'https://test.url/resource/123',
          },
          children: [
            {
              text: '',
            },
          ],
        },
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },
      ],
    },
  ];

  const htmlWithH5P =
    '<section><embed data-resource="h5p" data-path="/resource/123" data-url="https://test.url/resource/123"/></section>';

  test('serializing h5p', () => {
    const res = learningResourceContentToHTML(editorWithH5P);
    expect(res).toMatch(htmlWithH5P);
  });

  test('deserializing h5p', () => {
    const res = learningResourceContentToEditorValue(htmlWithH5P);
    expect(res).toEqual(editorWithH5P);
  });
});
