/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { PARAGRAPH_ELEMENT_TYPE, SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { AUDIO_ELEMENT_TYPE } from "../../audio/audioTypes";
import { H5P_ELEMENT_TYPE } from "../../h5p/types";
import { TYPE_IMAGE } from "../../image/types";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../../video/types";

describe("embed image serializing tests", () => {
  const editorWithImage: Descendant[] = [
    {
      type: SECTION_ELEMENT_TYPE,
      children: [
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },

        {
          type: TYPE_IMAGE,
          children: [
            {
              text: "",
            },
          ],
          data: {
            resource: "image",
            resourceId: "123",
            size: "small",
            align: "right",
            alt: "test-alt",
            caption: "test-caption",
            url: "https://test.url",
          },
        },
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      ],
    },
  ];

  const htmlWithImage =
    '<section><ndlaembed data-resource="image" data-resource_id="123" data-size="small" data-align="right" data-alt="test-alt" data-caption="test-caption" data-url="https://test.url"></ndlaembed></section>';

  test("serializing image", () => {
    const res = blockContentToHTML(editorWithImage);
    expect(res).toMatch(htmlWithImage);
  });

  test("deserializing image", () => {
    const res = blockContentToEditorValue(htmlWithImage);
    expect(res).toEqual(editorWithImage);
  });
});

describe("embed brightcove video serializing tests", () => {
  const editorWithBrightcove: Descendant[] = [
    {
      children: [
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },

        {
          type: BRIGHTCOVE_ELEMENT_TYPE,
          data: {
            resource: "brightcove",
            videoid: "123",
            caption: "test caption",
            account: "1000",
            player: "abc",
            url: "https://test.url",
            title: "test title",
          },
          children: [
            {
              text: "",
            },
          ],
        },
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      ],
      type: "section",
    },
  ];
  const htmlWithBrightcove =
    '<section><ndlaembed data-resource="brightcove" data-videoid="123" data-caption="test caption" data-account="1000" data-player="abc" data-url="https://test.url" data-title="test title"></ndlaembed></section>';
  test("serializing", () => {
    const res = blockContentToHTML(editorWithBrightcove);
    expect(res).toMatch(htmlWithBrightcove);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(htmlWithBrightcove);
    expect(res).toEqual(editorWithBrightcove);
  });
});

describe("embed audio serializing tests", () => {
  const editorWithAudio: Descendant[] = [
    {
      type: SECTION_ELEMENT_TYPE,
      children: [
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },

        {
          type: AUDIO_ELEMENT_TYPE,
          data: {
            resource: "audio",
            resourceId: "123",
            type: "standard",
            url: "https://test.url",
          },
          children: [
            {
              text: "",
            },
          ],
        },
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      ],
    },
  ];

  const htmlWithAudio =
    '<section><ndlaembed data-resource="audio" data-resource_id="123" data-type="standard" data-url="https://test.url"></ndlaembed></section>';

  test("serializing audio", () => {
    const res = blockContentToHTML(editorWithAudio);
    expect(res).toMatch(htmlWithAudio);
  });

  test("deserializing audio", () => {
    const res = blockContentToEditorValue(htmlWithAudio);
    expect(res).toEqual(editorWithAudio);
  });
});

describe("embed podcast serializing tests", () => {
  const editorWithPodcast: Descendant[] = [
    {
      type: SECTION_ELEMENT_TYPE,
      children: [
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
        {
          type: AUDIO_ELEMENT_TYPE,
          data: {
            resource: "audio",
            resourceId: "123",
            type: "podcast",
            url: "https://test.url",
          },
          children: [
            {
              text: "",
            },
          ],
        },
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      ],
    },
  ];

  const htmlWithPodcast =
    '<section><ndlaembed data-resource="audio" data-resource_id="123" data-type="podcast" data-url="https://test.url"></ndlaembed></section>';

  test("serializing podcast", () => {
    const res = blockContentToHTML(editorWithPodcast);
    expect(res).toMatch(htmlWithPodcast);
  });

  test("deserializing podcast", () => {
    const res = blockContentToEditorValue(htmlWithPodcast);
    expect(res).toEqual(editorWithPodcast);
  });
});

describe("embed h5p serializing tests", () => {
  const editorWithH5P: Descendant[] = [
    {
      type: SECTION_ELEMENT_TYPE,
      children: [
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },

        {
          type: H5P_ELEMENT_TYPE,
          data: {
            resource: "h5p",
            path: "/resource/123",
            url: "https://test.url/resource/123",
          },
          children: [
            {
              text: "",
            },
          ],
        },
        { type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: "" }] },
      ],
    },
  ];

  const htmlWithH5P =
    '<section><ndlaembed data-resource="h5p" data-path="/resource/123" data-url="https://test.url/resource/123"></ndlaembed></section>';

  test("serializing h5p", () => {
    const res = blockContentToHTML(editorWithH5P);
    expect(res).toMatch(htmlWithH5P);
  });

  test("deserializing h5p", () => {
    const res = blockContentToEditorValue(htmlWithH5P);
    expect(res).toEqual(editorWithH5P);
  });
});
