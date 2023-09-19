/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import {
  blockContentToEditorValue,
  blockContentToHTML,
} from '../../../../../util/articleContentConverter';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { TYPE_SECTION } from '../../section/types';
import {
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_H5P,
  TYPE_EMBED_IMAGE,
} from '../types';
import { TYPE_AUDIO } from '../../audio/types';

describe('embed image serializing tests', () => {
  const editorWithImage: Descendant[] = [
    {
      type: TYPE_SECTION,
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },

        {
          type: TYPE_EMBED_IMAGE,
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
    '<section><ndlaembed data-resource="image" data-resource_id="123" data-size="small" data-align="right" data-alt="test-alt" data-caption="test-caption" data-url="https://test.url"></ndlaembed></section>';

  test('serializing image', () => {
    const res = blockContentToHTML(editorWithImage);
    expect(res).toMatch(htmlWithImage);
  });

  test('deserializing image', () => {
    const res = blockContentToEditorValue(htmlWithImage);
    expect(res).toEqual(editorWithImage);
  });
});

describe('embed brightcove video serializing tests', () => {
  const editorWithBrightcove: Descendant[] = [
    {
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },

        {
          type: TYPE_EMBED_BRIGHTCOVE,
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
    '<section><ndlaembed data-resource="brightcove" data-videoid="123" data-caption="test caption" data-account="1000" data-player="abc" data-url="https://test.url" data-title="test title"></ndlaembed></section>';
  test('serializing', () => {
    const res = blockContentToHTML(editorWithBrightcove);
    expect(res).toMatch(htmlWithBrightcove);
  });

  test('deserializing', () => {
    const res = blockContentToEditorValue(htmlWithBrightcove);
    expect(res).toEqual(editorWithBrightcove);
  });
});

describe('embed youtube video serializing tests', () => {
  const editorWithYotube: Descendant[] = [
    {
      children: [
        { type: TYPE_PARAGRAPH, children: [{ text: '' }] },

        {
          type: TYPE_EMBED_EXTERNAL,
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
    '<section><ndlaembed data-resource="external" data-url="https://www.youtube.com/watch?v=testurl" data-title="test title"></ndlaembed></section>';
  test('serializing', () => {
    const res = blockContentToHTML(editorWithYotube);
    expect(res).toMatch(htmlWithYoutube);
  });

  test('deserializing', () => {
    const res = blockContentToEditorValue(htmlWithYoutube);
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
          type: TYPE_AUDIO,
          data: {
            resource: 'audio',
            resourceId: '123',
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
    '<section><ndlaembed data-resource="audio" data-resource_id="123" data-type="standard" data-url="https://test.url"></ndlaembed></section>';

  test('serializing audio', () => {
    const res = blockContentToHTML(editorWithAudio);
    expect(res).toMatch(htmlWithAudio);
  });

  test('deserializing audio', () => {
    const res = blockContentToEditorValue(htmlWithAudio);
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
          type: TYPE_AUDIO,
          data: {
            resource: 'audio',
            resourceId: '123',
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
    '<section><ndlaembed data-resource="audio" data-resource_id="123" data-type="podcast" data-url="https://test.url"></ndlaembed></section>';

  test('serializing podcast', () => {
    const res = blockContentToHTML(editorWithPodcast);
    expect(res).toMatch(htmlWithPodcast);
  });

  test('deserializing podcast', () => {
    const res = blockContentToEditorValue(htmlWithPodcast);
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
          type: TYPE_EMBED_H5P,
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
    '<section><ndlaembed data-resource="h5p" data-path="/resource/123" data-url="https://test.url/resource/123"></ndlaembed></section>';

  test('serializing h5p', () => {
    const res = blockContentToHTML(editorWithH5P);
    expect(res).toMatch(htmlWithH5P);
  });

  test('deserializing h5p', () => {
    const res = blockContentToEditorValue(htmlWithH5P);
    expect(res).toEqual(editorWithH5P);
  });
});
